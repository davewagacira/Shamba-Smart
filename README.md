# ShambaSmart

Machine learning for Kenyan smallholder farmers (SWE2020C Assignment 4, Group 1).

- **Recommend a crop**: Random Forest classifier on soil N, P, K, pH, temperature, humidity and rainfall (22 crops, 99.55% test accuracy).
- **Predict yield**: Random Forest regressor on country, crop, year, temperature and pesticide use (R² 0.929 on 2009–2013).

The models are trained in `../ml/ShambaSmart - Model Development.ipynb`, exported to ONNX, and served by Next.js route handlers with `onnxruntime-node`.

## Run locally

```bash
npm install
npm run dev
```

## API

`POST /api/recommend` with `{ "N", "P", "K", "temperature", "humidity", "ph", "rainfall" }`

`POST /api/yield` with `{ "country", "crop", "year", "rainfall", "pesticides", "temperature" }`, or `{ "rows": [...] }` for up to 60 scenarios.

## Updating the models

Re-run the notebook, then copy `ml/models/*.onnx` to `models/` and `ml/models/metadata.json` to `src/data/`.
