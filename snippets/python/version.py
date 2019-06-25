# Copyright (c) Julian Rüth.
# Distributed under the terms of the Modified BSD License.

# Reads the version number from the package.json that should be symlinked here
# as version.json.

import json
import os.path

try:
    package_json = open(os.path.join(os.path.dirname(__file__), 'version.json'))
except IOError:
    package_json = open(os.path.join(os.path.dirname(__file__), 'package.json'))

package = json.load(package_json)
__version__ = package['version']

version_info = __version__.split('.')
if len(version_info) > 3:
    versison_info[3] = {
        'a': 'alpha',
        'b': 'beta',
        'rc': 'candidate'
    }[version_info[3]]

npm_name = package['name']
name = npm_name.replace('-', '_')
