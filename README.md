# marker.js Live &mdash; Display interactive image annotations

**[marker.js Live]** is a JavaScript library for overlaying dynamic interactive annotations on top of images. 

[marker.js Live] is a companion library for [marker.js 2]. While **marker.js 2** enables users to annotate images it produces both a static representation of the annotated image as well as a configuration dataset for future editing of the annotations. [marker.js Live] takes that configuration and displays it dynamically on top of original (untouched) images. This enables responsiveness, interactivity, and other use-cases beyond what static annotations could ever offer.

**marker.js Live** is extensible and enables you to pick and choose the [plugins](https://markerjs.com/docs/markerjs-live/plugins) to add just the functionality you need for your project.

## Installation

```
npm install markerjs-live
```

or 

```
yarn add markerjs-live
```

## Usage

To display dynamic image annotations in your project, first, annotate your images using [marker.js 2], grab the "state" configuration of the annotations, and then follow these 2 easy steps:

1. Create an instance of `mjslive.MarkerView` passing a target image reference to the constructor.
2. Call its `show()` method passing your annotation configuration (marker.js 2 state) to it.

That's it!

Here's a simple example:

```js
// skip this line if you are importing marker.js Live into the global space via the script tag
import * as mjslive from 'markerjs-live';

// create an instance of MarkerView and pass the target image reference as a parameter
const markerView = new mjslive.MarkerView(target);

// call the show() method and pass your annotation configuration (created with marker.js 2) as a parameter
markerView.show(markerState);
```

Obviously, there's much more [marker.js Live] can do: use the range of events to add your own custom functionality based on lifecycle and interactions, or just utilize the pre-made plugins to extend the core features, or create your own plugins and share them with the community.

For these and other uses please refer to the [marker.js Live documentation](https://markerjs.com/docs/markerjs-live/getting-started).

## Demos
Check out [marker.js Live demos](https://markerjs.com/demos/markerjs-live/all-defaults/) for various usage examples.

## More docs and tutorials
For a more detailed "Getting started" and other docs and tutorials, please refer to 
the [official documentation](https://markerjs.com/docs/markerjs-live/getting-started).


## License
Linkware (see [LICENSE](https://github.com/ailon/markerjs-live/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js website which should be retained.

Alternative licenses are available through the [marker.js website](https://markerjs.com).

[marker.js Live]: https://markerjs.com/products/markerjs-live
[marker.js 2]: https://markerjs.com/products/markerjs
