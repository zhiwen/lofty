
build_kernel_js:
	ant -buildfile build/build-kernel-js.xml lofty_kernel_js

build_kernel_css:
	ant -buildfile build/build-kernel-css.xml lofty_kernel_css

build_adapter:
	ant -buildfile build/build-adapter.xml lofty_adapter
