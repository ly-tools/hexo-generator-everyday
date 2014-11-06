var generator = hexo.extend.generator;

if (generator.register.length === 1){
  generator.register(require('./everyday'));
} else {
  generator.register('everyday', require('./everyday'));
}