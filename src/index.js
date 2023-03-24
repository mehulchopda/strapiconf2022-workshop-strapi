'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {
     //strapi.server.httpServer is the new update for Strapi V4
     var io = require("socket.io")(strapi.server.httpServer, {
      cors: { // cors setup
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });
    io.on("connection", function (socket) { //Listening for a connection from the frontend
      socket.on("join", ({ username }) => { // Listening for a join connection
        console.log("user connected");
        console.log("username is ", username);
        if (username) {
          socket.join("group"); // Adding the user to the group
          socket.emit("welcome", { // Sending a welcome message to the User
            user: "bot",
            text: `${username}, Welcome to the group chat`,
            userData: username,
          });
        } else {
          console.log("An error occurred");
        }
      });
      socket.on("sendMessage", async (data) => { // Listening for a sendMessage connection
        let strapiData = { // Generating the message data to be stored in Strapi
          data: {
            user: data.user,
            message: data.message,
          },
        };
        var axios = require("axios");
        const token = '9500eb3cbc4ec39402d929d8d6a921be4bdf089a50026c1d21fc8a66aec54c6a892a23e9faf9fb02f669d3f83fef571a0252e0cc96a35044ad61ccb0f98d6ad5bc5b52d8248b3958fd04973b01700042bb5ff10b63bda7e73e584c7b2eaf380bfc48bdd54f84d20593b1bcb1c8262119978edf5e755ca5853048791285fb2f54'
        let axiosConfig = {
          headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              "Authorization": `Basic ${token}`
          }
        };

        await axios
          .post("https://productivity-tips-strapi-5944.onrender.com/api/messages", strapiData, axiosConfig)//Storing the messages in Strapi
          .then((e) => {
            socket.broadcast.to("group").emit("message", {//Sending the message to the group
              user: data.username,
              text: data.message,
            });
          })
          .catch((e) => console.log("error", e.message));
      });
    });
  },
};
