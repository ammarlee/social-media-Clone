const path=require('path')
module.exports = {
  outputDir:path.resolve(__dirname,'../'),
devServer:{
  proxy:{
    '/api':{ 
      target:'https://facebook-clones.herokuapp.com/'
    }
  }
}
};

module.exports = {
  transpileDependencies: ["vuetify"]
};
