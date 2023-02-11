'use strict';

/**
 * buddy router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::buddy.buddy');
