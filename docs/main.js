/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_loaders_MTLLoader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/loaders/MTLLoader.js */ "./node_modules/three/examples/jsm/loaders/MTLLoader.js");
/* harmony import */ var three_examples_jsm_loaders_OBJLoader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/loaders/OBJLoader.js */ "./node_modules/three/examples/jsm/loaders/OBJLoader.js");




class ThreeJSContainer {
    scene;
    light;
    cloud;
    particleVelocity;
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        let renderer = new three__WEBPACK_IMPORTED_MODULE_3__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x0D1B2A));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_3__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        let orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        orbitControls.target.set(0, 10, 0);
        orbitControls.maxPolarAngle = Math.PI / 2;
        orbitControls.minDistance = 10;
        orbitControls.maxDistance = 100;
        orbitControls.enablePan = false;
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
            orbitControls.update();
            //console.log(`x : ${camera.position.x}, y : ${camera.position.y}, z : ${camera.position.z}`);
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_3__.Scene();
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0x9999FF);
        let lvec = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        let loadOBJ = (objFilePath, mtlFilePath) => {
            let object = new three__WEBPACK_IMPORTED_MODULE_3__.Object3D;
            const mtlLoader = new three_examples_jsm_loaders_MTLLoader_js__WEBPACK_IMPORTED_MODULE_1__.MTLLoader();
            mtlLoader.load(mtlFilePath, (material) => {
                material.preload();
                const objLoader = new three_examples_jsm_loaders_OBJLoader_js__WEBPACK_IMPORTED_MODULE_2__.OBJLoader();
                objLoader.setMaterials(material);
                objLoader.load(objFilePath, (obj) => {
                    object.add(obj);
                });
            });
            return object;
        };
        const mesh = loadOBJ("Tree.obj", "Tree.mtl");
        mesh.scale.set(2, 2, 2);
        this.scene.add(mesh);
        let generateSprite = (color) => {
            //新しいキャンバスの作成
            let canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            //円形のグラデーションの作成
            let context = canvas.getContext('2d');
            let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgb(155, 155, 155)');
            gradient.addColorStop(0.8, color);
            gradient.addColorStop(1, 'rgba(0,0,0,1)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            //テクスチャの生成
            let texture = new three__WEBPACK_IMPORTED_MODULE_3__.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        };
        const particleNum = 10000;
        let sakuraPosition = (positions, particleIndex) => {
            let sakuraRan1 = 2 * Math.PI * Math.random();
            let sakuraRan2 = Math.acos(2 * Math.random() - 1);
            let sakuraR = 20 * Math.cbrt(Math.random());
            let x = sakuraR * Math.sin(sakuraRan2) * Math.cos(sakuraRan1) * 1.5; // x座標
            let z = sakuraR * Math.cos(sakuraRan2) * 1.5; // z座標
            let y = sakuraR * Math.sin(sakuraRan2) * Math.sin(sakuraRan1) + 35 - Math.sqrt(x * x + z * z) / 3; // y座標
            positions[particleIndex * 3] = x;
            positions[particleIndex * 3 + 1] = y;
            positions[particleIndex * 3 + 2] = z;
        };
        let createParticles = (color) => {
            //ジオメトリの作成
            let geometry = new three__WEBPACK_IMPORTED_MODULE_3__.BufferGeometry();
            //マテリアルの作成
            const material = new three__WEBPACK_IMPORTED_MODULE_3__.PointsMaterial({
                color: 0xffffff,
                size: 0.5,
                transparent: true,
                blending: three__WEBPACK_IMPORTED_MODULE_3__.AdditiveBlending,
                depthWrite: false,
                map: generateSprite(color)
            });
            //particleの作成
            let positions = new Float32Array(particleNum * 3);
            this.particleVelocity = [];
            for (let i = 0; i < particleNum; i++) {
                sakuraPosition(positions, i);
                if (Math.random() > 0.1) { //木にくっついてる花びら
                    this.particleVelocity[i] = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 0, 0);
                }
                else { //落下中の花びら
                    this.particleVelocity[i] = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, (Math.random() - 1.1) * 5, -1);
                }
                for (let j = 0; j < 10; j++) { //動く前から落ちているように
                    positions[i * 3 + 1] += this.particleVelocity[i].y;
                    positions[i * 3 + 2] += this.particleVelocity[i].z;
                }
            }
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_3__.BufferAttribute(positions, 3));
            //THREE.Pointsの作成
            this.cloud = new three__WEBPACK_IMPORTED_MODULE_3__.Points(geometry, material);
            //シーンへの追加
            this.scene.add(this.cloud);
        };
        createParticles('rgba(255, 138, 230, 1)');
        const radius = 100;
        let ran1 = (Math.random() - 0.5) * 100 + 2 * radius;
        let ran2 = (Math.random() - 0.5) * 100 + 2 * radius;
        let ran3 = (Math.random() - 0.5) * 100 + 2 * radius;
        let ran4 = (Math.random() - 0.5) * 100 + 2 * radius;
        let ran5 = (Math.random() - 0.5) * 100 + 2 * radius;
        let ran6 = (Math.random() - 0.5) * 100 + 2 * radius;
        let TERRAIN = (u, v, target) => {
            const theta = u * 2 * Math.PI;
            const r = v * radius;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            let y1 = 2 * Math.sin(Math.sqrt((x - ran1) * (x - ran1) + (z - ran2) * (z - ran2)) / 10);
            let y2 = Math.sin(Math.sqrt((x - ran3) * (x - ran3) + (z - ran4) * (z - ran4)) / 8);
            let y3 = Math.sin(Math.sqrt((x - ran5) * (x - ran5) + (z - ran6) * (z - ran6)) / 5);
            let y = 0;
            const T = 10;
            const flatR = Math.PI;
            const waveEndR = 2 * T * Math.PI;
            if (r > waveEndR) {
                y = 3 * Math.cos(waveEndR / T);
            }
            else if (r > flatR) {
                y = 3 * Math.cos(r / T);
            }
            else {
                y = 3 * Math.cos(flatR / T);
            }
            y += (y1 + y2 + y3) / 5;
            target.set(x, y, z);
        };
        const geometry = new three__WEBPACK_IMPORTED_MODULE_3__.ParametricGeometry(TERRAIN, 100, 50);
        // 頂点数
        const count = geometry.attributes.position.count;
        // 色配列 (r, g, b) を頂点数 × 3のFloat32Arrayで用意
        const colors = new Float32Array(count * 3);
        // geometryにcolor属性をセット
        geometry.setAttribute('color', new three__WEBPACK_IMPORTED_MODULE_3__.BufferAttribute(colors, 3));
        const positions = geometry.attributes.position;
        const minY = -3;
        const maxY = 3;
        for (let i = 0; i < count; i++) {
            const y = positions.getY(i);
            const t = (y - minY) / (maxY - minY); // 0〜1に正規化
            // 茶色  から 緑色
            const r = 0.5 * (1 - t) + 0.3 * t;
            const g = 0.2 * (1 - t) + 0.7 * t;
            const b = 0.1 * (1 - t) + 0.2 * t;
            colors[i * 3] = r;
            colors[i * 3 + 1] = g;
            colors[i * 3 + 2] = b;
        }
        const material = new three__WEBPACK_IMPORTED_MODULE_3__.MeshPhongMaterial({
            vertexColors: true,
            side: three__WEBPACK_IMPORTED_MODULE_3__.DoubleSide,
            shininess: 10,
            transparent: false,
            opacity: 0.6,
            flatShading: false
        });
        const terrain = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(geometry, material);
        this.scene.add(terrain);
        let t = 0;
        let WATER = (u, v, target) => { };
        let paramGeometry = new three__WEBPACK_IMPORTED_MODULE_3__.ParametricGeometry(WATER, 100, 100);
        let paramMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshPhongMaterial({
            color: 0x00ffff,
            side: three__WEBPACK_IMPORTED_MODULE_3__.DoubleSide,
            transparent: true,
            opacity: 0.5,
            shininess: 100,
            specular: 0xffffff,
            flatShading: true,
        });
        let water = new three__WEBPACK_IMPORTED_MODULE_3__.Group();
        water.add(new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(paramGeometry, paramMaterial));
        this.scene.add(water);
        //terrain.visible = false;
        //water.visible = false;
        //mesh.visible = false;
        //this.cloud.visible = false;
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const clock = new three__WEBPACK_IMPORTED_MODULE_3__.Clock();
        let update = (time) => {
            //桜
            const geom = this.cloud.geometry;
            const positions = geom.getAttribute('position'); // 座標データ
            const deltaTime = clock.getDelta();
            for (let i = 0; i < positions.count; i++) {
                positions.setZ(i, positions.getZ(i) + this.particleVelocity[i].z * deltaTime);
                positions.setY(i, positions.getY(i) + this.particleVelocity[i].y * deltaTime);
                if (positions.getY(i) < -5) {
                    sakuraPosition(positions.array, i);
                }
            }
            positions.needsUpdate = true;
            //水
            t += 0.05;
            const posAttr = paramGeometry.getAttribute("position");
            const posArray = posAttr.array;
            for (let i = 0; i < posAttr.count; i++) {
                const u = (i % 101) / 100;
                const v = Math.floor(i / 101) / 100;
                let r = 100;
                let x = u * r - r / 2;
                let z = v * r - r / 2;
                let y1 = Math.sin(Math.sqrt((x - ran1) * (x - ran1) + (z - ran2) * (z - ran2)) / 2 - t / 2);
                let y2 = Math.sin(Math.sqrt((x - ran3) * (x - ran3) + (z - ran4) * (z - ran4)) / 2 - t / 3);
                let y3 = Math.sin(Math.sqrt((x - ran5) * (x - ran5) + (z - ran6) * (z - ran6)) - t / 4);
                posArray[i * 3 + 0] = x;
                posArray[i * 3 + 1] = (y1 + y2 + y3) / 30;
                posArray[i * 3 + 2] = z;
            }
            posAttr.needsUpdate = true;
            paramGeometry.computeVertexNormals();
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(-65, 10, -25));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js-node_modules_three_examples-5ef33c"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBK0I7QUFDMkM7QUFDTjtBQUNBO0FBRXBFLE1BQU0sZ0JBQWdCO0lBQ1YsS0FBSyxDQUFjO0lBQ25CLEtBQUssQ0FBYztJQUNuQixLQUFLLENBQWU7SUFDcEIsZ0JBQWdCLENBQWtCO0lBRTFDO0lBRUEsQ0FBQztJQUVELHFCQUFxQjtJQUNkLGlCQUFpQixHQUFHLENBQUMsS0FBYSxFQUFFLE1BQWMsRUFBRSxTQUF3QixFQUFFLEVBQUU7UUFDbkYsSUFBSSxRQUFRLEdBQUcsSUFBSSxnREFBbUIsRUFBRSxDQUFDO1FBQ3pDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSx3Q0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbEQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsZUFBZTtRQUVsRCxRQUFRO1FBQ1IsSUFBSSxNQUFNLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFaEMsSUFBSSxhQUFhLEdBQUcsSUFBSSxvRkFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxhQUFhLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQy9CLGFBQWEsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1FBRWhDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQiwwQkFBMEI7UUFDMUIsbUNBQW1DO1FBQ25DLElBQUksTUFBTSxHQUF5QixDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3hDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN2Qiw4RkFBOEY7WUFFOUYsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QixRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQzVDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDMUMsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFRCxnQkFBZ0I7SUFDUixXQUFXLEdBQUcsR0FBRyxFQUFFO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx3Q0FBVyxFQUFFLENBQUM7UUFFL0IsUUFBUTtRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxJQUFJLElBQUksR0FBRyxJQUFJLDBDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxXQUFtQixFQUFFLFdBQW1CLEVBQUUsRUFBRTtZQUN2RCxJQUFJLE1BQU0sR0FBRyxJQUFJLDJDQUFjLENBQUM7WUFDaEMsTUFBTSxTQUFTLEdBQUcsSUFBSSw4RUFBUyxFQUFFLENBQUM7WUFDbEMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDckMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNuQixNQUFNLFNBQVMsR0FBRyxJQUFJLDhFQUFTLEVBQUUsQ0FBQztnQkFDbEMsU0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFcEIsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDO1lBQ0YsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRTtZQUNuQyxhQUFhO1lBQ2IsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUVuQixlQUFlO1lBQ2YsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0ksUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUMvQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUUxQyxPQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUM3QixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEQsVUFBVTtZQUNWLElBQUksT0FBTyxHQUFHLElBQUksMENBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUMzQixPQUFPLE9BQU8sQ0FBQztRQUNuQixDQUFDO1FBRUQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRTFCLElBQUksY0FBYyxHQUFHLENBQUMsU0FBdUIsRUFBRSxhQUFxQixFQUFFLEVBQUU7WUFDcEUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzdDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLE9BQU8sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU07WUFDM0UsSUFBSSxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTTtZQUNwRCxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU07WUFDekcsU0FBUyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsU0FBUyxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBR0QsSUFBSSxlQUFlLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRTtZQUNwQyxVQUFVO1lBQ1YsSUFBSSxRQUFRLEdBQUcsSUFBSSxpREFBb0IsRUFBRSxDQUFDO1lBQzFDLFVBQVU7WUFDVixNQUFNLFFBQVEsR0FBRyxJQUFJLGlEQUFvQixDQUFDO2dCQUN0QyxLQUFLLEVBQUUsUUFBUTtnQkFDZixJQUFJLEVBQUUsR0FBRztnQkFDVCxXQUFXLEVBQUUsSUFBSTtnQkFDakIsUUFBUSxFQUFFLG1EQUFzQjtnQkFDaEMsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLEdBQUcsRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDO2FBQzdCLENBQUM7WUFDRixhQUFhO1lBQ2IsSUFBSSxTQUFTLEdBQUcsSUFBSSxZQUFZLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsYUFBYTtvQkFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksMENBQWEsQ0FDeEMsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLENBQ0osQ0FBQztpQkFDTDtxQkFBTSxFQUFFLFNBQVM7b0JBQ2QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksMENBQWEsQ0FDeEMsQ0FBQyxFQUNELENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFDekIsQ0FBQyxDQUFDLENBQ0wsQ0FBQztpQkFDTDtnQkFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsZUFBZTtvQkFDMUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEQ7YUFDSjtZQUVELFFBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksa0RBQXFCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsaUJBQWlCO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx5Q0FBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsRCxTQUFTO1lBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUU5QixDQUFDO1FBRUQsZUFBZSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFMUMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBRW5CLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBRXBELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxNQUFxQixFQUFFLEVBQUU7WUFDMUQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3pGLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdEIsTUFBTSxRQUFRLEdBQUcs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QUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1RixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1RixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hGLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDeEIsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDMUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzNCO1lBQ0QsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDM0IsYUFBYSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFHckMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDSjtBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVsRCxTQUFTLElBQUk7SUFDVCxJQUFJLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFFdkMsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSwwQ0FBYSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsQ0FBQzs7Ozs7OztVQ3BURDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCB7IE1UTExvYWRlciB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL01UTExvYWRlci5qcyc7XG5pbXBvcnQgeyBPQkpMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9PQkpMb2FkZXIuanMnO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGNsb3VkOiBUSFJFRS5Qb2ludHM7XG4gICAgcHJpdmF0ZSBwYXJ0aWNsZVZlbG9jaXR5OiBUSFJFRS5WZWN0b3IzW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspKlxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGxldCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4MEQxQjJBKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy/jgrfjg6Pjg4njgqbjg57jg4Pjg5fjgpLmnInlirnjgavjgZnjgotcblxuICAgICAgICAvL+OCq+ODoeODqeOBruioreWumlxuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcblxuICAgICAgICBsZXQgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgICAgIG9yYml0Q29udHJvbHMudGFyZ2V0LnNldCgwLCAxMCwgMCk7XG4gICAgICAgIG9yYml0Q29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLyAyO1xuICAgICAgICBvcmJpdENvbnRyb2xzLm1pbkRpc3RhbmNlID0gMTA7XG4gICAgICAgIG9yYml0Q29udHJvbHMubWF4RGlzdGFuY2UgPSAxMDA7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGxldCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGB4IDogJHtjYW1lcmEucG9zaXRpb24ueH0sIHkgOiAke2NhbWVyYS5wb3NpdGlvbi55fSwgeiA6ICR7Y2FtZXJhLnBvc2l0aW9uLnp9YCk7XG5cbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy/jg6njgqTjg4jjga7oqK3lrppcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4OTk5OUZGKTtcbiAgICAgICAgbGV0IGx2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIGxldCBsb2FkT0JKID0gKG9iakZpbGVQYXRoOiBzdHJpbmcsIG10bEZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0Q7XG4gICAgICAgICAgICBjb25zdCBtdGxMb2FkZXIgPSBuZXcgTVRMTG9hZGVyKCk7XG4gICAgICAgICAgICBtdGxMb2FkZXIubG9hZChtdGxGaWxlUGF0aCwgKG1hdGVyaWFsKSA9PiB7XG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwucHJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iakxvYWRlciA9IG5ldyBPQkpMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICBvYmpMb2FkZXIuc2V0TWF0ZXJpYWxzKG1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICBvYmpMb2FkZXIubG9hZChvYmpGaWxlUGF0aCwgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuYWRkKG9iaik7XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVzaCA9IGxvYWRPQkooXCJUcmVlLm9ialwiLCBcIlRyZWUubXRsXCIpXG4gICAgICAgIG1lc2guc2NhbGUuc2V0KDIsIDIsIDIpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoKTtcblxuICAgICAgICBsZXQgZ2VuZXJhdGVTcHJpdGUgPSAoY29sb3I6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgLy/mlrDjgZfjgYTjgq3jg6Pjg7Pjg5Djgrnjga7kvZzmiJBcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IDE2O1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IDE2O1xuXG4gICAgICAgICAgICAvL+WGhuW9ouOBruOCsOODqeODh+ODvOOCt+ODp+ODs+OBruS9nOaIkFxuICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGxldCBncmFkaWVudCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoY2FudmFzLndpZHRoIC8gMiwgY2FudmFzLmhlaWdodCAvIDIsIDAsIGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyLCBjYW52YXMud2lkdGggLyAyKTtcbiAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiKDE1NSwgMTU1LCAxNTUpJyk7XG4gICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC44LCBjb2xvcik7XG4gICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMSknKTtcblxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIC8v44OG44Kv44K544OB44Oj44Gu55Sf5oiQXG4gICAgICAgICAgICBsZXQgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcyk7XG4gICAgICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0dXJlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFydGljbGVOdW0gPSAxMDAwMDtcblxuICAgICAgICBsZXQgc2FrdXJhUG9zaXRpb24gPSAocG9zaXRpb25zOiBGbG9hdDMyQXJyYXksIHBhcnRpY2xlSW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgbGV0IHNha3VyYVJhbjEgPSAyICogTWF0aC5QSSAqIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBsZXQgc2FrdXJhUmFuMiA9IE1hdGguYWNvcygyICogTWF0aC5yYW5kb20oKSAtIDEpO1xuICAgICAgICAgICAgbGV0IHNha3VyYVIgPSAyMCAqIE1hdGguY2JydChNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgIGxldCB4ID0gc2FrdXJhUiAqIE1hdGguc2luKHNha3VyYVJhbjIpICogTWF0aC5jb3Moc2FrdXJhUmFuMSkgKiAxLjU7IC8vIHjluqfmqJlcbiAgICAgICAgICAgIGxldCB6ID0gc2FrdXJhUiAqIE1hdGguY29zKHNha3VyYVJhbjIpICogMS41OyAvLyB65bqn5qiZXG4gICAgICAgICAgICBsZXQgeSA9IHNha3VyYVIgKiBNYXRoLnNpbihzYWt1cmFSYW4yKSAqIE1hdGguc2luKHNha3VyYVJhbjEpICsgMzUgLSBNYXRoLnNxcnQoeCAqIHggKyB6ICogeikgLyAzOyAvLyB55bqn5qiZXG4gICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCAqIDNdID0geDtcbiAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4ICogMyArIDFdID0geTtcbiAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4ICogMyArIDJdID0gejtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IGNyZWF0ZVBhcnRpY2xlcyA9IChjb2xvcjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAvL+OCuOOCquODoeODiOODquOBruS9nOaIkFxuICAgICAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgICAgICAvL+ODnuODhuODquOCouODq+OBruS9nOaIkFxuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgICAgIGNvbG9yOiAweGZmZmZmZixcbiAgICAgICAgICAgICAgICBzaXplOiAwLjUsXG4gICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWFwOiBnZW5lcmF0ZVNwcml0ZShjb2xvcilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvL3BhcnRpY2xl44Gu5L2c5oiQXG4gICAgICAgICAgICBsZXQgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShwYXJ0aWNsZU51bSAqIDMpO1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlTnVtOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzYWt1cmFQb3NpdGlvbihwb3NpdGlvbnMsIGkpO1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC4xKSB7IC8v5pyo44Gr44GP44Gj44Gk44GE44Gm44KL6Iqx44Gz44KJXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVWZWxvY2l0eVtpXSA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy/okL3kuIvkuK3jga7oirHjgbPjgolcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgLSAxLjEpICogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC0xXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykgeyAvL+WLleOBj+WJjeOBi+OCieiQveOBoeOBpuOBhOOCi+OCiOOBhuOBq1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnNbaSAqIDMgKyAxXSArPSB0aGlzLnBhcnRpY2xlVmVsb2NpdHlbaV0ueTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zW2kgKiAzICsgMl0gKz0gdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldLno7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKTtcbiAgICAgICAgICAgIC8vVEhSRUUuUG9pbnRz44Gu5L2c5oiQXG4gICAgICAgICAgICB0aGlzLmNsb3VkID0gbmV3IFRIUkVFLlBvaW50cyhnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgLy/jgrfjg7zjg7Pjgbjjga7ov73liqBcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2xvdWQpXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVBhcnRpY2xlcygncmdiYSgyNTUsIDEzOCwgMjMwLCAxKScpO1xuXG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IDEwMDtcblxuICAgICAgICBsZXQgcmFuMSA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEwMCArIDIgKiByYWRpdXM7XG4gICAgICAgIGxldCByYW4yID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMTAwICsgMiAqIHJhZGl1cztcbiAgICAgICAgbGV0IHJhbjMgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAxMDAgKyAyICogcmFkaXVzO1xuICAgICAgICBsZXQgcmFuNCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEwMCArIDIgKiByYWRpdXM7XG4gICAgICAgIGxldCByYW41ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMTAwICsgMiAqIHJhZGl1cztcbiAgICAgICAgbGV0IHJhbjYgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAxMDAgKyAyICogcmFkaXVzO1xuXG4gICAgICAgIGxldCBURVJSQUlOID0gKHU6IG51bWJlciwgdjogbnVtYmVyLCB0YXJnZXQ6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRoZXRhID0gdSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICAgICAgY29uc3QgciA9IHYgKiByYWRpdXM7XG4gICAgICAgICAgICBjb25zdCB4ID0gciAqIE1hdGguY29zKHRoZXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHogPSByICogTWF0aC5zaW4odGhldGEpO1xuICAgICAgICAgICAgbGV0IHkxID0gMiAqIE1hdGguc2luKE1hdGguc3FydCgoeCAtIHJhbjEpICogKHggLSByYW4xKSArICh6IC0gcmFuMikgKiAoeiAtIHJhbjIpKSAvIDEwKTtcbiAgICAgICAgICAgIGxldCB5MiA9IE1hdGguc2luKE1hdGguc3FydCgoeCAtIHJhbjMpICogKHggLSByYW4zKSArICh6IC0gcmFuNCkgKiAoeiAtIHJhbjQpKSAvIDgpO1xuICAgICAgICAgICAgbGV0IHkzID0gTWF0aC5zaW4oTWF0aC5zcXJ0KCh4IC0gcmFuNSkgKiAoeCAtIHJhbjUpICsgKHogLSByYW42KSAqICh6IC0gcmFuNikpIC8gNSk7XG4gICAgICAgICAgICBsZXQgeSA9IDA7XG4gICAgICAgICAgICBjb25zdCBUID0gMTA7XG4gICAgICAgICAgICBjb25zdCBmbGF0UiA9IE1hdGguUEk7XG4gICAgICAgICAgICBjb25zdCB3YXZlRW5kUiA9IDIgKiBUICogTWF0aC5QSTtcbiAgICAgICAgICAgIGlmIChyID4gd2F2ZUVuZFIpIHtcbiAgICAgICAgICAgICAgICB5ID0gMyAqIE1hdGguY29zKHdhdmVFbmRSIC8gVCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHIgPiBmbGF0Uikge1xuICAgICAgICAgICAgICAgIHkgPSAzICogTWF0aC5jb3MociAvIFQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB5ID0gMyAqIE1hdGguY29zKGZsYXRSIC8gVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ICs9ICh5MSArIHkyICsgeTMpIC8gNTtcbiAgICAgICAgICAgIHRhcmdldC5zZXQoeCwgeSwgeik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QYXJhbWV0cmljR2VvbWV0cnkoVEVSUkFJTiwgMTAwLCA1MCk7XG5cbiAgICAgICAgLy8g6aCC54K55pWwXG4gICAgICAgIGNvbnN0IGNvdW50ID0gZ2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbi5jb3VudDtcblxuICAgICAgICAvLyDoibLphY3liJcgKHIsIGcsIGIpIOOCkumggueCueaVsCDDlyAz44GuRmxvYXQzMkFycmF544Gn55So5oSPXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkoY291bnQgKiAzKTtcblxuICAgICAgICAvLyBnZW9tZXRyeeOBq2NvbG9y5bGe5oCn44KS44K744OD44OIXG4gICAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZSgnY29sb3InLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGNvbG9ycywgMykpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IGdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb247XG4gICAgICAgIGNvbnN0IG1pblkgPSAtMztcbiAgICAgICAgY29uc3QgbWF4WSA9IDM7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB5ID0gcG9zaXRpb25zLmdldFkoaSk7XG4gICAgICAgICAgICBjb25zdCB0ID0gKHkgLSBtaW5ZKSAvIChtYXhZIC0gbWluWSk7ICAvLyAw44CcMeOBq+ato+imj+WMllxuXG4gICAgICAgICAgICAvLyDojLboibIgIOOBi+OCiSDnt5HoibJcbiAgICAgICAgICAgIGNvbnN0IHIgPSAwLjUgKiAoMSAtIHQpICsgMC4zICogdDtcbiAgICAgICAgICAgIGNvbnN0IGcgPSAwLjIgKiAoMSAtIHQpICsgMC43ICogdDtcbiAgICAgICAgICAgIGNvbnN0IGIgPSAwLjEgKiAoMSAtIHQpICsgMC4yICogdDtcblxuICAgICAgICAgICAgY29sb3JzW2kgKiAzXSA9IHI7XG4gICAgICAgICAgICBjb2xvcnNbaSAqIDMgKyAxXSA9IGc7XG4gICAgICAgICAgICBjb2xvcnNbaSAqIDMgKyAyXSA9IGI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XG4gICAgICAgICAgICB2ZXJ0ZXhDb2xvcnM6IHRydWUsXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgICAgICAgICAgc2hpbmluZXNzOiAxMCxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiBmYWxzZSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgIGZsYXRTaGFkaW5nOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGVycmFpbiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRlcnJhaW4pO1xuXG4gICAgICAgIGxldCB0ID0gMDtcblxuICAgICAgICBsZXQgV0FURVIgPSAodTogbnVtYmVyLCB2OiBudW1iZXIsIHRhcmdldDogVEhSRUUuVmVjdG9yMykgPT4geyB9XG4gICAgICAgIGxldCBwYXJhbUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBhcmFtZXRyaWNHZW9tZXRyeShXQVRFUiwgMTAwLCAxMDApO1xuICAgICAgICBsZXQgcGFyYW1NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogMHgwMGZmZmYsXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjUsXG4gICAgICAgICAgICBzaGluaW5lc3M6IDEwMCxcbiAgICAgICAgICAgIHNwZWN1bGFyOiAweGZmZmZmZixcbiAgICAgICAgICAgIGZsYXRTaGFkaW5nOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgd2F0ZXIgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgICAgd2F0ZXIuYWRkKG5ldyBUSFJFRS5NZXNoKHBhcmFtR2VvbWV0cnksIHBhcmFtTWF0ZXJpYWwpKTtcblxuICAgICAgICB0aGlzLnNjZW5lLmFkZCh3YXRlcik7XG5cbiAgICAgICAgLy90ZXJyYWluLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgLy93YXRlci52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIC8vbWVzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIC8vdGhpcy5jbG91ZC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yM5pu05pawXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG5cbiAgICAgICAgICAgIC8v5qGcXG4gICAgICAgICAgICBjb25zdCBnZW9tID0gPFRIUkVFLkJ1ZmZlckdlb21ldHJ5PnRoaXMuY2xvdWQuZ2VvbWV0cnk7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBnZW9tLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKTsgLy8g5bqn5qiZ44OH44O844K/XG4gICAgICAgICAgICBjb25zdCBkZWx0YVRpbWUgPSBjbG9jay5nZXREZWx0YSgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5zZXRaKGksIHBvc2l0aW9ucy5nZXRaKGkpICsgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldLnogKiBkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5zZXRZKGksIHBvc2l0aW9ucy5nZXRZKGkpICsgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldLnkgKiBkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbnMuZ2V0WShpKSA8IC01KSB7XG4gICAgICAgICAgICAgICAgICAgIHNha3VyYVBvc2l0aW9uKHBvc2l0aW9ucy5hcnJheSBhcyBGbG9hdDMyQXJyYXksIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc2l0aW9ucy5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cblxuICAgICAgICAgICAgLy/msLRcbiAgICAgICAgICAgIHQgKz0gMC4wNTtcbiAgICAgICAgICAgIGNvbnN0IHBvc0F0dHIgPSBwYXJhbUdlb21ldHJ5LmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpO1xuICAgICAgICAgICAgY29uc3QgcG9zQXJyYXkgPSBwb3NBdHRyLmFycmF5IGFzIEZsb2F0MzJBcnJheTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zQXR0ci5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdSA9IChpICUgMTAxKSAvIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gTWF0aC5mbG9vcihpIC8gMTAxKSAvIDEwMDtcbiAgICAgICAgICAgICAgICBsZXQgciA9IDEwMDtcbiAgICAgICAgICAgICAgICBsZXQgeCA9IHUgKiByIC0gciAvIDI7XG4gICAgICAgICAgICAgICAgbGV0IHogPSB2ICogciAtIHIgLyAyO1xuICAgICAgICAgICAgICAgIGxldCB5MSA9IE1hdGguc2luKE1hdGguc3FydCgoeCAtIHJhbjEpICogKHggLSByYW4xKSArICh6IC0gcmFuMikgKiAoeiAtIHJhbjIpKSAvIDIgLSB0IC8gMik7XG4gICAgICAgICAgICAgICAgbGV0IHkyID0gTWF0aC5zaW4oTWF0aC5zcXJ0KCh4IC0gcmFuMykgKiAoeCAtIHJhbjMpICsgKHogLSByYW40KSAqICh6IC0gcmFuNCkpIC8gMiAtIHQgLyAzKTtcbiAgICAgICAgICAgICAgICBsZXQgeTMgPSBNYXRoLnNpbihNYXRoLnNxcnQoKHggLSByYW41KSAqICh4IC0gcmFuNSkgKyAoeiAtIHJhbjYpICogKHogLSByYW42KSkgLSB0IC8gNCk7XG4gICAgICAgICAgICAgICAgcG9zQXJyYXlbaSAqIDMgKyAwXSA9IHg7XG4gICAgICAgICAgICAgICAgcG9zQXJyYXlbaSAqIDMgKyAxXSA9ICh5MSArIHkyICsgeTMpIC8gMzA7XG4gICAgICAgICAgICAgICAgcG9zQXJyYXlbaSAqIDMgKyAyXSA9IHo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb3NBdHRyLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHBhcmFtR2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcblxuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcblxuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoLTY1LCAxMCwgLTI1KSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzX2pzbV9jb250cm9sc19PcmJpdENvbnRyb2xzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlcy01ZWYzM2NcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=