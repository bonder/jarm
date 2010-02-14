/**
 * Copyright (C) 2010 Rob Britton

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var distSq = function(pos1, pos2){
  return (pos1.top - pos2.top) * (pos1.top - pos2.top) +
    (pos1.left - pos2.left) * (pos1.left - pos2.left);
}

var near = function(obj1, obj2, radius){
  var centre1 = obj1.position();
  centre1.left += obj1.width() / 2;
  centre1.top += obj1.height() / 2;
  var centre2 = obj2.position();
  centre2.left += obj2.width() / 2;
  centre2.top += obj2.height() / 2;

  return distSq(centre1, centre2) <= radius * radius;
}

/** Maps an array and then merges the elements.
 *
 * @param arr - the array to map and join
 * @param sep - the separator
 * @param foo - the map function
 *
 * If only two arguments are provided, the second one
 * is the map function and the separator is an empty
 * string.
 */
function mapJoin(arr, sep, foo){
  if (foo === undefined){
    foo = sep;
    sep = "";
  }
  return $.map(arr, foo).join(sep);
}

/** Filters an array and then merges the elements.
 *
 * @param arr - the array to filter and join
 * @param sep - the separator
 * @param foo - the filter function
 *
 * If only two arguments are provided, the second one
 * is the map function and the separator is an empty
 * string.
 */
function filterJoin(arr, sep, foo){
  if (foo === undefined){
    foo = sep;
    sep = "";
  }
  return $.grep(arr, foo).join(sep);
}
