module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    './src/assets/': '/',
  });
  eleventyConfig.addPassthroughCopy({
    './src/_data/': '/_data',
  });
  eleventyConfig.addPassthroughCopy('admin');

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
