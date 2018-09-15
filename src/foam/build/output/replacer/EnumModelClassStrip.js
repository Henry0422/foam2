foam.CLASS({
  name: 'EnumModelClassStrip',
  package: 'foam.build.output.replacer',
  extends: 'foam.build.output.replacer.ClassStrip',
  requires: [
    'foam.core.EnumModel',
  ],
  properties: [
    {
      name: 'where',
      factory: function() {
        var self = this;
        return [
          self.AND(
            self.IS_TYPE(self.EnumModel),
            self.FUNC(function(v) {
              return self.chain.length == 1
            })
          )
        ]
      },
    },
  ],
});
