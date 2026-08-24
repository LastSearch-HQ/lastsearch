# Wind-down bridges (publish Sept 19, unpublish Nov 1)
Final versions of every old-name package: install → warn → delegate to the
lastsearch equivalents. Publishing (after new packages are live):
  cd bridges/npm/browseai-dev && npm publish   (repeat for browse-ai)
  cd bridges/pypi/browseaidev && python -m build && twine upload dist/*   (repeat ×4)
Then: npm deprecate browseai-dev "Renamed to lastsearch — lastsearch.ai/migrate"
