# Copyright (c) Julian Rüth
# Distributed under the terms of the Modified BSD License.

# Setup to link the Python code to the JavaScript assets in the frontend.

from .version import name

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        # location of the static JavaScript assets that
        # are loaded by the notebook
        'src': 'nbextension',
        # directory in the nbextension/ namespace
        'dest': name,
        # entrypoint in the nbextension/ namespace, refers to the corresponding
        # .js file in nbextension/ that contains the minimal requirejs setup.
        'require': '%s/extension'%(name,)
    }]
