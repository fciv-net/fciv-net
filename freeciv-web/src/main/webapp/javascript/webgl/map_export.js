/**********************************************************************
    FCIV.NET - the web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2023  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/


/****************************************************************************
...
****************************************************************************/
function stl_export() {
  var exporter = new STLExporter();
  const result = exporter.parse( scene, { binary: true } );
  saveArrayBuffer( result, 'fciv.stl' );

}


function save( blob, filename ) {
  const link = document.createElement( 'a' );
  link.style.display = 'none';
  document.body.appendChild( link );
  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();

}

function saveString( text, filename ) {
  save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function saveArrayBuffer( buffer, filename ) {
  save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}
