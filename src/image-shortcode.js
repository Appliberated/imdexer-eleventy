/**
 * Copyright 2024 Appliberated (https://appliberated.com). All rights reserved.
 * See LICENSE in the project root for license information.
 * @author TechAurelian <dev@techaurelian.com> (https://techaurelian.com)
 */

import { PACKAGE_NAME } from './consts.js';
import { joinPosixPath } from './utils.js';

/**
 * Adds the specified image shortcode to Eleventy.
 * 
 * @param {object} eleventyConfig The Eleventy configuration object.
 * @param {string} shortcodeName The name of the shortcode.
 * @param {object} imdexer The imdexer object containing data for the images.
 * @param {string} baseUrl The base URL for the images.
 */
export function addImageShortcode(eleventyConfig, shortcodeName, zones) {

  /**
   * Returns the content for the image shortcode, which is a HTML image tag with attributes
   * computed from the provided arguments.
   * @param {object} args The arguments for the shortcode.
   * @returns {string} The HTML image tag.
   */
  const imageShortcode = function (args) {

    // Get the image data based on the optional prefix and available zones
    const data = getImageData(args.src, zones);

    // Generate and return the HTML image tag
    // return generateImageTag(data.imdexer, data.baseUrl, data.imageSrc, args.class, args.alt);
    return generateImageTag({ alt: args.alt, baseUrl: data.baseUrl, classAttr: args.class, imdexer: data.imdexer, lazy: args.lazy, sizes: args.sizes, src: data.imageSrc, defaultImage: args.defaultImage });
  };

  // Add the shortcode to Eleventy
  eleventyConfig.addShortcode(shortcodeName, imageShortcode);
}

/**
 * Gets the image data for the specified image source based on the available zones.
 * 
 * @param {string} src The source of the image.
 * @param {Array} zones The array of image zones.
 * @returns {Object} The image data object containing the image source, imdexer, and base URL.
 */
function getImageData(src, zones) {

  // If there is only one entry in the zones array, return its data
  if (zones.length === 1) {
    return {
      imageSrc: src, // There should be no prefix to remove
      imdexer: zones[0].imdexer,
      baseUrl: zones[0].baseUrl,
    }
  }

  // Otherwise, find the zone that matches the image source based on the prefix, and return its data
  for (const zone of zones) {
    if (src.startsWith(zone.prefix)) {
      return {
        imageSrc: src.slice(zone.prefix.length), // Remove the prefix from the image source
        imdexer: zone.imdexer,
        baseUrl: zone.baseUrl,
      }
    }
  }

  // If no zone matches the image source, throw an error
  throw new Error(`No zone found for image: ${src}`);
}

/**
 * Generates an image tag for the specified image.
 * 
 * @param {Object} imdexer The imdexer object containing data for the images.
 * @param {string} baseUrl The base URL for the images.
 * @param {string} src The source of the image.
 * @param {string} classAttr The class attribute for the image.
 * @param {string} alt The alt attribute for the image.
 * @returns {string} The HTML image tag.
 */
// function generateImageTag(imdexer, baseUrl, src, classAttr, alt) {
// function generateImageTag(imdexer, baseUrl, src, classAttr, alt, srcImage, lazy = false, sizes='auto') {
function generateImageTag({ alt, baseUrl, classAttr, defaultImage, imdexer, lazy = false, sizes = 'auto', src } = {}) {

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

    // Correctly join the base URL and the image source
    const fullSrc = joinPosixPath(baseUrl, src);

    // Add the lazy loading attribute if specified
    const loadingAttr = lazy ? 'loading="lazy"' : '';

    // Return the image tag
    return `<img ${loadingAttr} width="${width}" height="${height}" src="${fullSrc}" ${classAttr ? `class="${classAttr}"` : ''} alt="${alt}" />`;
  }

  // If we are here, this is a grouped image, so let's generate a responsive image tag

  // Generate the srcset attribute
  const srcset = Object.keys(data.files).map(file => {
    const fullSrc = joinPosixPath(baseUrl, file);
    return `${fullSrc} ${data.files[file].width}w`;
  }).join(', ');

  // Get the largest image based on the width
  const largestImage = Object.keys(data.files).reduce((a, b) => data.files[a].width > data.files[b].width ? a : b);

  // If the defaultImage is provided, use it, otherwise use the largest image for the src attribute
  const fullSrc = defaultImage ? joinPosixPath(baseUrl, defaultImage) : joinPosixPath(baseUrl, largestImage);

  const width = data.files[largestImage].width;
  const height = data.files[largestImage].height;

  // Add the lazy loading attribute if specified or if the sizes attribute is set to auto
  const loadingAttr = lazy || sizes === 'auto' ? 'loading="lazy"' : '';

  // Return the image tag with all the responsive image attributes
  return `<img ${loadingAttr} sizes="${sizes}" width="${width}" height="${height}" srcset="${srcset}" src="${fullSrc}" ${classAttr ? `class="${classAttr}"` : ''} alt="${alt}" />`;
}
