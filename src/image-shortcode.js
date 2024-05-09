/**
 * Copyright 2024 Appliberated (https://appliberated.com). All rights reserved.
 * See LICENSE in the project root for license information.
 * @author TechAurelian <dev@techaurelian.com> (https://techaurelian.com)
 */

import path from 'node:path';

import { PACKAGE_NAME } from './consts.js';

/**
 * Adds the specified image shortcode to Eleventy.
 * 
 * @param {object} eleventyConfig The Eleventy configuration object.
 * @param {string} shortcodeName The name of the shortcode.
 * @param {object} imdexer The imdexer object containing data for the images.
 * @param {string} rootPath The root path for the images.
 */
export function addImageShortcode(eleventyConfig, shortcodeName, imdexer, rootPath) {

  /**
   * Returns the content for the image shortcode, which is a HTML image tag with attributes
   * computed from the provided arguments.
   * @param {object} args The arguments for the shortcode.
   * @returns {string} The HTML image tag.
   */
  const imageShortcode = function(args) {
    return generateImageTag(imdexer, rootPath, args.src, args.class, args.alt);
  };

  // Add the shortcode to Eleventy
  eleventyConfig.addShortcode(shortcodeName, imageShortcode);
}


/**
 * Generates an image tag for the specified image.
 * 
 * @param {Object} imdexer The imdexer object containing data for the images.
 * @param {string} rootPath The root path for the images.
 * @param {string} src The source of the image.
 * @param {string} classAttr The class attribute for the image.
 * @param {string} alt The alt attribute for the image.
 * @returns {string} The HTML image tag.
 */
function generateImageTag(imdexer, rootPath, src, classAttr, alt) {

  if (!imdexer) {
    throw new Error(`${PACKAGE_NAME} requires an imdexer object.`);
  }

  // Check if alt text is provided. This is required for accessibility.
  // For decorative images, use an empty string for the alt attribute.
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` attribute for image: ${src}`);
  }

  if (!src) {
    throw new Error(`Missing \`src\` attribute for image: ${src}`);
  }

  // Get the image data from the imdexer
  const data = imdexer[src];
  if (!data) {
    throw new Error(`Missing image data for image: ${src}`);
  }

  // If this is a single (non-grouped) image, return a simple image tag
  if (!data.files) {
    // Get the image size from the image data
    const width = data.width;
    const height = data.height;

    // Correctly join the root path and the image source
    const fullSrc = path.posix.join(rootPath, src);

    // Return the image tag
    return `<img src="${fullSrc}" ${classAttr ? `class="${classAttr}"` : ''} width="${width}" height="${height}" alt="${alt}" />`;
  }
}
