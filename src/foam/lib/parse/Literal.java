/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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

package foam.lib.parse;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Literal
  implements Parser
{
  protected final static Map map_ = new ConcurrentHashMap();

  public static Parser create(String s) {
    if ( s == null ) return new Literal(s, s);

    Parser p = (Parser) map_.get(s);

    if ( p == null ) {
      p = new Literal(s, s);
      map_.put(s, p);
    }

    return p;
  }

  protected String string_;
  protected Object value_;

  public Literal(String s, Object v) {
    string_ = s;
    value_  = v;
  }

  public PStream parse(PStream ps, ParserContext x) {
    if ( string_ == null ) return null;

    for ( int i = 0 ; i < string_.length() ; i++ ) {
      if ( ! ps.valid() || ps.head() != string_.charAt(i) ) return null;

      ps = ps.tail();
    }

    return ps.setValue(value_);
  }

  public String toString() {
    return "Literal(" + string_ + ")";
  }
}
