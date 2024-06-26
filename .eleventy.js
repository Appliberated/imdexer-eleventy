/**
 * Copyright 2024 Appliberated (https://appliberated.com). All rights reserved.
 * See LICENSE in the project root for license information.
 * @author TechAurelian <dev@techaurelian.com> (https://techaurelian.com)
 */

import { addImageShortcode } from "./src/image-shortcode.js";

// /**
//  * Validates the provided option by throwing an error if it is not defined.
//  * 
//  * @param {object} options The options object.
//  * @param {string} name The name of the option.
//  */
// function validateOption(options, name) {
//   if (!options[name]) throw new Error(`eleventy-mapped-images requires a ${name} option.`);
// }

export default function (eleventyConfig, options = {}) {
  // Validate options
  // validateOption(options, 'imageMaps');

  if (options.imgShortcode) {
    addImageShortcode(eleventyConfig, options.imgShortcode, options.zones);
  }

  // The options object can contain one or more shortcodes to add in the shortcodes array
  // Add the shortcodes to Eleventy
  // if (options.shortcodes) {
  //   for (const shortcode of options.shortcodes) {
  //     addImageShortcode(eleventyConfig, shortcode.name, shortcode.imdexer, shortcode.baseUrl);
  //   }
  // }
};