# zd-webcomponent
---
Repository contains Web Component implementation of Zoomdata Visualization for Bars chart.

# How to run example
---
##### Prerequisites
You must have yarn or npm installed, also any static web server to host files.
##### Run
Clone this repo then run:
```yarn```
```serve ./```

Then open localhost:5000 and you should see similar picture:
![Screenshot of Zoomdata](https://i.imgur.com/4tyWYlp.png)

# Usage
---
You can embed such control in your application by simply adding these lines:

```html
<script type="module" src="<path_to_this_repo>/src/zoomdata-visualization.js"></script>
```

```html
<zoomdata-visualization style="position: absolute; width: 600px; height: 500px;"
      key="KVKWiD8kUl"
      host="developer.zoomdata.com"
      secure="true"
      port="443"
      path="/zoomdata-2.6"
      source-name="My IMPALA Source"
      visualization="Bars"
    />
```

Where host, secure, port, path, source-name and visualization attribute are all configurable!