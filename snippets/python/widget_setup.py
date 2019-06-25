from glob import glob
from os.path import join as pjoin
from version import __version__, name, package

from setupbase import (create_cmdclass, install_npm, ensure_targets, find_packages, combine_commands, ensure_python, get_version, HERE)

# Ensure a supported python version
ensure_python('>=3.4')

package_data_spec = {
    name: ['nbextension/*.*js*', 'labextension/*.tgz']
}

nb_path = pjoin(HERE, 'src', name, 'nbextension')
lab_path = pjoin(HERE, 'src', name, 'labextension')

# Representative files that should exist after a successful build
jstargets = [
    pjoin(nb_path, 'index.js'),
    pjoin(HERE, 'lib', 'plugin.js'),
]

data_files_spec = [
    ('share/jupyter/nbextensions/%s'%(name,), nb_path, '*.js*'),
    ('share/jupyter/lab/extensions', lab_path, '*.tgz'),
    ('etc/jupyter/nbconfig/notebook.d' , HERE, '%s.json'%(name,))
]

cmdclass = create_cmdclass('jsdeps', package_data_spec=package_data_spec, data_files_spec=data_files_spec)
cmdclass['jsdeps'] = combine_commands(install_npm(HERE, build_cmd='build'), ensure_targets(jstargets),)

def create_setup_args():
    return dict(
        name            = name,
        description     = package['description'],
        version         = __version__,
        scripts         = glob(pjoin('scripts', '*')),
        cmdclass        = cmdclass,
        packages        = find_packages(),
        author          = package['author']['name'],
        author_email    = package['author']['email'],
        url             = package['homepage'],
        license         = package['license'],
        platforms       = "Linux, Mac OS X, Windows",
        keywords        = ['Jupyter', 'Widgets', 'IPython'],
        classifiers     = [],
        include_package_data = True,
        install_requires = [ 'ipywidgets>=7.0.0' ],
        extras_require = {},
        entry_points = { },
    )
