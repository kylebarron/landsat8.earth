# landsat8.earth

2D/3D WebGL-powered Landsat 8 satellite imagery analysis

[![](./assets/eastern_sierra_false_color.jpg)](https://landsat8.earth)

3D, False-color Infrared Landsat visualization of the Eastern Sierra

## Overview

Landsat8.earth is an application to explore Landsat 8 imagery in the browser.

The backend runs on AWS Lambda is powered by Cloud-Optimized GeoTIFFs, a fast
cloud-native file format that enables streaming portions of raster images. It
draws from the huge repository of Landsat data publicly available on S3, thanks
to the AWS Open Data program.

[`landsat-mosaic-tiler`][landsat-mosaic-tiler] is the backend; a Python
application running on AWS Lambda.
[`landsat-cogeo-mosaic`][landsat-cogeo-mosaic] is used to pregenerate mosaics
(collections) of Landsat images, enabling a visualization of many images at
once. [`landsat-mosaic-latest`][landsat-mosaic-latest] keeps an updated Landsat
mosaic, allowing for the option of viewing the latest available imagery.

[landsat-mosaic-tiler]: https://github.com/kylebarron/landsat-mosaic-tiler
[landsat-cogeo-mosaic]: https://github.com/kylebarron/landsat-cogeo-mosaic
[landsat-mosaic-latest]: https://github.com/kylebarron/landsat-mosaic-latest


### Credits

<div>Icon used as website favicon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
