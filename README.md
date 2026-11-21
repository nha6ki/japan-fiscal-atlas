# Japan Fiscal Atlas | 日本財政アトラス

[Explore the forecasts](https://nha6ki.github.io/japan-fiscal-atlas/) · [Portfolio project](https://nha6ki.github.io/projects/japan-fiscal-atlas/)

This Japanese-language static site compares the initial budget or plan with statistical adjustments for eight annual fiscal indicators. Each study uses the budget enactment date as its information cutoff. The year-by-year comparisons are historical reconstructions.

Run `python3 -m http.server 8000` in this directory and open http://localhost:8000/. Pages are selected by URL fragments. Data files, source notes and annual error charts accompany the individual studies. The JRA study includes a Python reproduction script in `jra-data/`.

GitHub Pages serves the root of the main branch. No build or external JavaScript dependencies are required. Consult the source and attribution notes in each study before reusing its data.
