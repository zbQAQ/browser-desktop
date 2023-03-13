module.exports =  class InlineSourceHtmlPlugin {
  constructor(htmlWebpackPlugin, tests = []) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.tests = tests;
  }

  getInlinedTag(publicPath, assets, tag) {
    let scriptName = ''
    let outputTagName = ''
    if (tag.tagName === 'script' && tag.attributes && tag.attributes.src) {
      scriptName = publicPath
        ? tag.attributes.src.replace(publicPath, '')
        : tag.attributes.src;
      outputTagName = 'script'
    } else if(tag.tagName === 'link' && tag.attributes && tag.attributes.href) {
      scriptName = publicPath
        ? tag.attributes.href.replace(publicPath, '')
        : tag.attributes.href;
      outputTagName = 'style'
    }

    if(scriptName === '' || outputTagName === '') return tag;
    if (!this.tests.some(test => scriptName.match(test))) return tag;

    const asset = assets[scriptName];
    if (asset == null) {
      return tag;
    }
    return { tagName: outputTagName, innerHTML: asset.source(), closeTag: true };
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || '';
    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap('InlineSourceHtmlPlugin', compilation => {
      const tagFunction = tag =>
        this.getInlinedTag(publicPath, compilation.assets, tag);
      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
        assets.headTags = assets.headTags.map(tagFunction);
        assets.bodyTags = assets.bodyTags.map(tagFunction);
      });
    });
  }
}
