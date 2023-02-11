'use strict';

/**
 * buddy service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::buddy.buddy');
