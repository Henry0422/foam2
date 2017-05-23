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
package foam.dao.index;

import foam.core.FObject;
import foam.dao.Sink;
import foam.mlang.predicate.Predicate;
import java.util.Comparator;

/** Found that no data exists for the query. **/
public class NotFoundPlan implements FindPlan, SelectPlan
{
  protected final static NotFoundPlan instance_ = new NotFoundPlan();

  public static NotFoundPlan instance() { return instance_; }

  protected NotFoundPlan() {}

  public long cost() { return 0; }

  public FObject find(Object state, Object key) {
    return null;
  }

  public void select(Object state, Sink sink, int skip, int limit, Comparator order, Predicate predicate) {
  }
}