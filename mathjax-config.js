MathJax.Hub.Config({
  extensions: ["tex2jax.js"],
  showProcessingMessages: false,
  jax: ["input/TeX", "output/HTML-CSS"],
  TeX: {
    Augment: {
      Definitions: {
        macros: {
          unitfrac: "myUnitFrac",
          unit: "myUnit"
        }
      },
      Parse: {
        prototype: {
          myUnitFrac: function(name) {
            var n = this.GetBrackets(name),
              num = this.GetArgument(name),
              den = this.GetArgument(name);
            if (n == null) {
              n = ""
            }
            var tex = n + '\\,\\text{' + num + '}/\\text{' + den + '}';
            this.string = tex + this.string.slice(this.i);
            this.i = 0;
          },
          myUnit: function(name) {
            var n = this.GetBrackets(name),
              dim = this.GetArgument(name);
            if (n == null) {
              n = ""
            }
            var tex = n + '\\,\\text{' + dim + '}';
            this.string = tex + this.string.slice(this.i);
            this.i = 0;
          }
        }
      }
    }
  },
  tex2jax: {
    inlineMath: [
      ['$', '$'],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ['$$', '$$'],
      ["\\[", "\\]"]
    ],
    processEscapes: true
  },
  "HTML-CSS": {
    availableFonts: ["TeX"]
  }
});