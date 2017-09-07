/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

foam.CLASS({
  package: 'foam.dao',
  name: 'ResetSink',
  extends: 'foam.dao.ProxySink',
  implements: [ 'foam.core.Serializable' ],
  methods: [
    {
      name: 'put',
      code: function(obj, sub) { this.reset(s); },
      javaCode: 'reset(sub);'
    },
    {
      name: 'remove',
      code: function(obj, sub) { this.reset(s); },
      javaCode: 'reset(sub);'
    }
  ]
});

foam.CLASS({
  package: 'foam.dao',
  name: 'MergedResetSink',
  extends: 'foam.dao.ResetSink',
  implements: [ 'foam.core.Serializable' ],
  methods: [
    {
      name: 'reset',
      code: function(sub) { this.doReset(sub); },
      javaCode: `doReset(sub);`
    }
  ],
  listeners: [
    {
      name: 'doReset',
      isMerged: true,
      mergeDelay: 200,
      code: function(sub) {
        this.delegate.reset(sub);
      },
      javaCode: `
try {
  getDelegate().reset((foam.core.Detachable)event);
} catch(Exception e) {
  ((foam.core.Detachable)event).detach();
}
`
    }
  ]
});

foam.CLASS({
  package: 'foam.dao',
  name: 'ClientDAO',
  extends: 'foam.dao.BaseClientDAO',

  requires: [
    'foam.core.Serializable',
    'foam.dao.ClientSink',
    'foam.box.SkeletonBox'
  ],

  methods: [
    function put_(x, obj) {
      return this.SUPER(null, obj);
    },

    function remove_(x, obj) {
      return this.SUPER(null, obj);
    },

    function find_(x, key) {
      return this.SUPER(null, key);
    },

    function select_(x, sink, skip, limit, order, predicate) {
      if ( predicate === foam.mlang.predicate.True.create() ) predicate = null;
      if ( ! skip ) skip = 0;
      if ( ! limit ) limit = Number.MAX_SAFE_INTEGER;

      if ( ! this.Serializable.isInstance(sink) ) {
        var self = this;

        return this.SUPER(null, null, skip, limit, order, predicate).then(function(result) {
          var items = result.array;

          if ( ! sink ) return result;

          var sub = foam.core.FObject.create();
          var detached = false;
          sub.onDetach(function() { detached = true; });

          for ( var i = 0 ; i < items.length ; i++ ) {
            if ( detached ) break;

            sink.put(items[i], sub);
          }

          sink.eof();

          return sink;
        });
      }

      return this.SUPER(null, sink, skip, limit, order, predicate);
    },

    function removeAll_(x, skip, limit, order, predicate) {
      if ( predicate === foam.mlang.predicate.True.create() ) predicate = null;
      if ( ! skip ) skip = 0;
      if ( ! limit ) limit = Number.MAX_SAFE_INTEGER;

      return this.SUPER(null, skip, limit, order, predicate);
    },

    function listen_(x, sink, predicate) {
      // TODO: This should probably just be handled automatically via a RemoteSink/Listener
      // TODO: Unsubscribe support.

      var skeleton = this.SkeletonBox.create({
        data: sink
      });

      var clientSink = this.ClientSink.create({
        delegate: this.__context__.registry.register(
          null,
          this.delegateReplyPolicy,
          skeleton
        )
      });

      clientSink = foam.dao.MergedResetSink.create({
        delegate: clientSink
      });

      this.SUPER(null, clientSink, predicate);
    }
  ]
});
