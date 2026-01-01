/* eslint-disable no-undef */

document.body.innerHTML =
  '<style>div{color: grey;text-align:center;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;width:500px;height:100px;}</style><body><div id="loading"><p>This could take a while, please give it at least 5 minutes to render.</p><br><h1 class="spin">⏳</h1><br><h3>Press <strong>?</strong> for shortcut keys</h3><br><p><small>Output contains an embedded blueprint for creating an IRL wall sculpture</small></p></div></body>';

window.onload = function () {
  document.body.innerHTML =
    '<style>body {margin: 0px;text-align: center;}</style>';

  const sketch = (p) => {
    let initialTime;
    let fileName;
    let artCanvas;
    let renderTime;

    let wide = 800;
    let high = 1000;
    let panelWide = 1600;
    let panelHigh = 2000;

    let ratio = 1;
    let minOffset = 7;
    let framewidth = 50;
    let framradius = 0;

    let scale = 1;
    let stacks = 12;
    let numofcolors = 6;

    let colors = [];
    let palette = [];

    let origin = { x: 500, y: 500 };
    let spokes = 20;
    let wavyness = 120;
    let swirly = 20;
    let dripRadius = 6;
    let dripfrequency = 0.3;
    let dripstart = 3;

    let distribution = 800;
    let linecolor = { Hex: '#4C4638', Name: 'Mocha' };
    let frameColor = '#60513D';
    let fColor = { Hex: '#60513D', Name: 'Walnut' };

    let noise;

    const interactiontext =
      'Interactions\nP = Export PNG\nC = Export colors as TXT\n? = Show shortcut keys';

    const baseScale = 2.2;

    function initializeParams() {
      setquery('fxhash', $fx.hash);
      initialTime = Date.now();
      fileName = $fx.hash;

      const seed = parseInt($fx.hash.slice(2, 10), 16);
      noise = new perlinNoise3d();
      noise.noiseSeed(seed);

      let qcolor1 = 'AllColors';
      if (new URLSearchParams(window.location.search).get('c1')) {
        qcolor1 = new URLSearchParams(window.location.search).get('c1');
      }
      let qcolor2 = 'None';
      if (new URLSearchParams(window.location.search).get('c2')) {
        qcolor2 = new URLSearchParams(window.location.search).get('c2');
      }
      let qcolor3 = 'None';
      if (new URLSearchParams(window.location.search).get('c3')) {
        qcolor3 = new URLSearchParams(window.location.search).get('c3');
      }
      let qcolors = R.random_int(1, 6);
      if (new URLSearchParams(window.location.search).get('c')) {
        qcolors = new URLSearchParams(window.location.search).get('c');
      }
      let qsize = '2';
      if (new URLSearchParams(window.location.search).get('s')) {
        qsize = new URLSearchParams(window.location.search).get('s');
      }
      let qcomplexity = R.random_int(1, 10);
      if (new URLSearchParams(window.location.search).get('d')) {
        qcomplexity = new URLSearchParams(window.location.search).get('d');
      }
      qcomplexity = qcomplexity * 4;
      let qlayers = 12;
      if (new URLSearchParams(window.location.search).get('l')) {
        qlayers = new URLSearchParams(window.location.search).get('l');
      }

      const qorientation =
        R.random_int(1, 2) < 2 ? 'portrait' : 'landscape';
      const qwavyness = R.random_int(10, 250);
      const qswirly = R.random_int(5, 50);
      const qdripfrequency = R.random_int(0, 100) / 100;
      const qdripstart = R.random_int(1, 9);
      const qdripRadius = R.random_int(1, 10);
      const qoriginx = R.random_int(0, 1000);
      const qoriginy = R.random_int(0, 1000);
      const qmatwidth = R.random_int(50, 100);
      const qframecolor =
        R.random_int(0, 3) < 1
          ? 'Random'
          : R.random_int(1, 3) < 2
          ? 'White'
          : 'Mocha';

      const definitions = [
        {
          id: 'layers',
          name: 'Layers',
          type: 'number',
          default: qlayers,
          options: {
            min: 6,
            max: 100,
            step: 1,
          },
        },
        {
          id: 'orientation',
          name: 'Orientation',
          type: 'select',
          default: qorientation,
          options: { options: ['portrait', 'landscape'] },
        },
        {
          id: 'aspectratio',
          name: 'Aspect ratio',
          type: 'select',
          default: '4:5',
          options: { options: ['1:1', '2:5', '3:5', '4:5', '54:86', '296:420'] },
        },
        {
          id: 'size',
          name: 'Size',
          type: 'select',
          default: qsize,
          options: { options: ['1', '2', '3'] },
        },
        {
          id: 'colors',
          name: 'Max # of colors',
          type: 'number',
          default: qcolors,
          options: {
            min: 1,
            max: 12,
            step: 1,
          },
        },
        {
          id: 'colors1',
          name: 'Pallete 1',
          type: 'select',
          default: qcolor1,
          options: { options: palleteNames },
        },
        {
          id: 'colors2',
          name: 'Pallete 2',
          type: 'select',
          default: qcolor2,
          options: { options: palleteNames },
        },
        {
          id: 'colors3',
          name: 'Pallete 3',
          type: 'select',
          default: qcolor3,
          options: { options: palleteNames },
        },
        {
          id: 'framecolor',
          name: 'Frame color',
          type: 'select',
          default: qframecolor,
          options: { options: ['Random', 'White', 'Mocha'] },
        },
        {
          id: 'spokes',
          name: 'Rays',
          type: 'number',
          default: qcomplexity,
          options: {
            min: 6,
            max: 40,
            step: 1,
          },
        },
        {
          id: 'wavyness',
          name: 'Wavyness',
          type: 'number',
          default: qwavyness,
          options: {
            min: 10,
            max: 250,
            step: 1,
          },
        },
        {
          id: 'swirly',
          name: 'Swirlyness',
          type: 'number',
          default: qswirly,
          options: {
            min: 5,
            max: 50,
            step: 1,
          },
        },
        {
          id: 'dripfrequency',
          name: 'Chance of drips',
          type: 'number',
          default: qdripfrequency,
          options: {
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        {
          id: 'dripstart',
          name: 'Drip begin',
          type: 'number',
          default: qdripstart,
          options: {
            min: 1,
            max: 9,
            step: 1,
          },
        },
        {
          id: 'dripRadius',
          name: 'Drip end',
          type: 'number',
          default: qdripRadius,
          options: {
            min: 1,
            max: 10,
            step: 1,
          },
        },
        {
          id: 'originx',
          name: 'Origin X',
          type: 'number',
          default: qoriginx,
          options: {
            min: 0,
            max: 1000,
            step: 1,
          },
        },
        {
          id: 'originy',
          name: 'Origin Y',
          type: 'number',
          default: qoriginy,
          options: {
            min: 0,
            max: 1000,
            step: 1,
          },
        },
        {
          id: 'matwidth',
          name: 'Mat size',
          type: 'number',
          default: qmatwidth,
          options: {
            min: 50,
            max: 200,
            step: 10,
          },
        },
      ];

      $fx.params(definitions);
      scale = $fx.getParam('size');
      stacks = $fx.getParam('layers');
      numofcolors = $fx.getParam('colors');

      if ($fx.getParam('aspectratio') === '1:1') {
        wide = 800;
        high = 800;
      }
      if ($fx.getParam('aspectratio') === '2:5') {
        wide = 400;
        high = 1000;
      }
      if ($fx.getParam('aspectratio') === '3:5') {
        wide = 600;
        high = 1000;
      }
      if ($fx.getParam('aspectratio') === '4:5') {
        wide = 800;
        high = 1000;
      }
      if ($fx.getParam('aspectratio') === '54:86') {
        wide = 540;
        high = 860;
      }
      if ($fx.getParam('aspectratio') === '296:420') {
        wide = 705;
        high = 1000;
      }

      ratio = 1 / scale;
      minOffset = Math.trunc(7 * ratio);
      framewidth = Math.trunc($fx.getParam('matwidth') * ratio * scale);
      framradius = 0;

      panelWide = 1600;
      panelHigh = 2000;

      const qColors1 = window[$fx.getParam('colors1')] || [];
      const qColors2 = window[$fx.getParam('colors2')] || [];
      const qColors3 = window[$fx.getParam('colors3')] || [];

      const newPalette = qColors1.concat(qColors2, qColors3);
      for (let c = 0; c < numofcolors; c += 1) {
        palette[c] = newPalette[R.random_int(0, newPalette.length - 1)];
      }

      let pIndex = 0;
      for (let c = 0; c < stacks; c += 1) {
        colors[c] = palette[pIndex];
        pIndex += 1;
        if (pIndex === palette.length) {
          pIndex = 0;
        }
      }

      if ($fx.getParam('framecolor') === 'White') {
        colors[stacks - 1] = { Hex: '#FFFFFF', Name: 'Smooth White' };
      }
      if ($fx.getParam('framecolor') === 'Mocha') {
        colors[stacks - 1] = { Hex: '#4C4638', Name: 'Mocha' };
      }

      fColor = frameColors[R.random_int(0, frameColors.length - 1)];
      frameColor = fColor.Hex;
      fColor = { Hex: '#60513D', Name: 'Walnut' };
      frameColor = fColor.Hex;

      let orientation = 'Portrait';
      if ($fx.getParam('orientation') === 'landscape') {
        [wide, high] = [high, wide];
        orientation = 'Landscape';
      }

      distribution = R.random_int(600, Math.trunc(Math.sqrt(high * high + wide * wide)));
      origin = { x: $fx.getParam('originx'), y: $fx.getParam('originy') };
      spokes = $fx.getParam('spokes');
      wavyness = $fx.getParam('wavyness');
      swirly = $fx.getParam('swirly');
      dripRadius = $fx.getParam('dripRadius');
      dripfrequency = 1 - $fx.getParam('dripfrequency');
      dripstart = $fx.getParam('dripstart');

      console.log(`${orientation}: ${Math.trunc(wide / 100 / ratio)} x ${Math.trunc(high / 100 / ratio)}`);
      console.log(`${stacks} layers`);
      console.log(`${numofcolors} colors`);
      console.log(`Frame Color: ${fColor.Name}`);
      console.log(`Origin: ${origin.x}, ${origin.y}`);
      console.log(`Spokes: ${spokes}`);
      console.log(`Wavyness: ${wavyness}`);
      console.log(`Swirlyness: ${swirly}`);
      console.log(`Distribution: ${distribution}`);
      console.log(`Drip Radius: ${dripRadius}`);
      console.log(`Drip frequency: ${dripfrequency}`);
      console.log(`Drip start: ${dripstart}`);

      linecolor = { Hex: '#4C4638', Name: 'Mocha' };
    }

    function drawFrameOutline() {
      p.noFill();
      p.stroke(linecolor.Hex);
      p.strokeWeight(1 * ratio);
      p.rect(0, 0, wide, high, framradius);
    }

    function drawLayerShape(z, centerX, centerY, radius) {
      const steps = Math.max(48, spokes * 6);
      p.beginShape();
      for (let i = 0; i <= steps; i += 1) {
        const angle = p.TWO_PI * (i / steps);
        const nx = Math.cos(angle) * 0.8;
        const ny = Math.sin(angle) * 0.8;
        const offset = (noise.get(nx, ny, z * 0.1) - 0.5) * wavyness * ((z + 1) / swirly);
        const r = radius + offset;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);

      for (let n = dripstart; n < dripRadius; n += 1) {
        if (noise.get(z * 0.2, n * 0.3, z) > dripfrequency) {
          const dripAngle = p.TWO_PI * (n / dripRadius);
          const dripX = centerX + Math.cos(dripAngle) * (radius * 0.9);
          const dripY = centerY + Math.sin(dripAngle) * (radius * 0.9);
          const dripSize = Math.max(1, noise.get(z, n, z) * (minOffset * 2) * (z + 1));
          p.circle(dripX, dripY, dripSize);
        }
      }
    }

    function drawArt() {
      p.background('#ffffff');
      p.push();
      const xOffset = (p.width - wide * baseScale) / 2;
      const yOffset = (p.height - high * baseScale) / 2;
      p.translate(xOffset, yOffset);
      p.scale(baseScale);

      const originOffsetX = (origin.x - 500) * ratio * 0.5;
      const originOffsetY = (origin.y - 500) * ratio * 0.5;
      const centerX = wide / 2 + originOffsetX;
      const centerY = high / 2 + originOffsetY;

      for (let z = 0; z < stacks; z += 1) {
        const layerOffset = minOffset * (stacks - z - 1);
        const baseRadius = Math.min(wide, high) / 2 - framewidth - layerOffset;
        p.push();
        p.noStroke();
        p.fill(colors[z].Hex);
        p.drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
        p.drawingContext.shadowBlur = 20;
        p.drawingContext.shadowOffsetX = (stacks - z) * 2.3;
        p.drawingContext.shadowOffsetY = (stacks - z) * 2.3;
        drawLayerShape(z, centerX, centerY, baseRadius);
        p.pop();
      }

      p.push();
      p.drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowOffsetX = stacks * 2.3;
      p.drawingContext.shadowOffsetY = stacks * 2.3;
      drawFrameOutline();
      p.pop();
      p.pop();
    }

    function buildFeatures() {
      const features = {};
      features.Size = `${Math.trunc(wide / 100 / ratio)} x ${Math.trunc(high / 100 / ratio)} inches`;
      features.Width = Math.trunc(wide / 100 / ratio);
      features.Height = Math.trunc(high / 100 / ratio);
      features.Depth = stacks * 0.0625;
      features.Layers = stacks;
      for (let l = stacks; l > 0; l -= 1) {
        const key = `layer: ${stacks - l + 1}`;
        features[key] = colors[l - 1].Name;
      }
      console.log(features);
      $fx.features(features);
      return features;
    }

    async function sendAllExports(features) {
      if (!artCanvas) {
        return;
      }
      await sendCanvasToBubbleAPI(artCanvas.elt, $fx.hash);
      const content = JSON.stringify(features, null, 2);
      await sendTextToBubbleAPI(`Colors-${$fx.hash}`, content);
      sendFeaturesAPI(features);
      console.log('All exports sent!');
    }

    function downloadText(filename, content) {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    p.setup = () => {
      artCanvas = p.createCanvas(2400, 2400);
      artCanvas.id('myCanvas');
      initializeParams();
      drawArt();

      const features = buildFeatures();

      if (new URLSearchParams(window.location.search).get('skart')) {
        sendAllExports(features);
      }

      const finalTime = Date.now();
      renderTime = (finalTime - initialTime) / 1000;
      console.log(`Render took : ${renderTime.toFixed(2)} seconds`);

      p.noLoop();
    };

    p.doubleClicked = () => {
      alert(interactiontext);
    };

    p.keyPressed = () => {
      if (p.key === '?' || p.key === '/' || p.key === 'h') {
        alert(interactiontext);
      }
      if (p.key === 'p') {
        p.saveCanvas(artCanvas, fileName, 'png');
      }
      if (p.key === 'c') {
        const content = JSON.stringify(buildFeatures(), null, 2);
        downloadText(`Colors-${$fx.hash}.txt`, content);
      }
      if (p.key === ' ') {
        setquery('fxhash', null);
        location.reload();
      }
    };
  };

  // eslint-disable-next-line no-new
  new p5(sketch);
};
