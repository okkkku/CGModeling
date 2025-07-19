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
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_3__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        let orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        orbitControls.target.set(0, 10, 0);
        orbitControls.maxPolarAngle = Math.PI / 2;
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
        this.light = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0xffffff);
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
        const mesh = loadOBJ("/Tree.obj", "/Tree.mtl");
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
                if (Math.random() > 0.2) { //木にくっついてる花びら
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
            // 茶色  から 緑色  への補間
            const r = 0.6 * (1 - t) + 0.3 * t;
            const g = 0.6 * (1 - t) + 0.7 * t;
            const b = 0.4 * (1 - t) + 0.2 * t;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUU5QixDQUFDO1FBRUQsZUFBZSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFMUMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBRW5CLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBRXBELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxNQUFxQixFQUFFLEVBQUU7WUFDMUQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3pGLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRTtnQkFDZCxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2xDO2lCQUFNLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRTtnQkFDbEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMzQjtpQkFBTTtnQkFDSCxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLHFEQUF3QixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFaEUsTUFBTTtRQUNOLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUVqRCx5Q0FBeUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTNDLHVCQUF1QjtRQUN2QixRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLGtEQUFxQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJFLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztRQUVmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFFLFVBQVU7WUFFakQsa0JBQWtCO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLG9EQUF1QixDQUFDO1lBQ3pDLFlBQVksRUFBRSxJQUFJO1lBQ2xCLElBQUksRUFBRSw2Q0FBZ0I7WUFDdEIsU0FBUyxFQUFFLEVBQUU7WUFDYixXQUFXLEVBQUUsS0FBSztZQUNsQixPQUFPLEVBQUUsR0FBRztZQUNaLFdBQVcsRUFBRSxLQUFLO1NBQ3JCLENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLElBQUksdUNBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQXFCLEVBQUUsRUFBRSxHQUFHLENBQUM7UUFDaEUsSUFBSSxhQUFhLEdBQUcsSUFBSSxxREFBd0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xFLElBQUksYUFBYSxHQUFHLElBQUksb0RBQXVCLENBQUM7WUFDNUMsS0FBSyxFQUFFLFFBQVE7WUFDZixJQUFJLEVBQUUsNkNBQWdCO1lBQ3RCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLE9BQU8sRUFBRSxHQUFHO1lBQ1osU0FBUyxFQUFFLEdBQUc7WUFDZCxRQUFRLEVBQUUsUUFBUTtZQUNsQixXQUFXLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssR0FBRyxJQUFJLHdDQUFXLEVBQUUsQ0FBQztRQUM5QixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksdUNBQVUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUV4RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QiwwQkFBMEI7UUFDMUIsd0JBQXdCO1FBRXhCLHNCQUFzQjtRQUN0QixtQ0FBbUM7UUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSx3Q0FBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxNQUFNLEdBQXlCLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFFeEMsR0FBRztZQUNILE1BQU0sSUFBSSxHQUF5QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUN2RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUTtZQUN6RCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztnQkFDOUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ3hCLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDdEQ7YUFDSjtZQUNELFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRzdCLEdBQUc7WUFDSCxDQUFDLElBQUksSUFBSSxDQUFDO1lBQ1YsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN2RCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBcUIsQ0FBQztZQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RixRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMzQjtZQUNELE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQzNCLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBR3JDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBQ0o7QUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFbEQsU0FBUyxJQUFJO0lBQ1QsSUFBSSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBRXZDLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksMENBQWEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7Ozs7Ozs7VUNoVEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgeyBNVExMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9NVExMb2FkZXIuanMnO1xuaW1wb3J0IHsgT0JKTG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvT0JKTG9hZGVyLmpzJztcblxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG4gICAgcHJpdmF0ZSBsaWdodDogVEhSRUUuTGlnaHQ7XG4gICAgcHJpdmF0ZSBjbG91ZDogVEhSRUUuUG9pbnRzO1xuICAgIHByaXZhdGUgcGFydGljbGVWZWxvY2l0eTogVEhSRUUuVmVjdG9yM1tdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKSpcbiAgICBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBsZXQgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy/jgrfjg6Pjg4njgqbjg57jg4Pjg5fjgpLmnInlirnjgavjgZnjgotcblxuICAgICAgICAvL+OCq+ODoeODqeOBruioreWumlxuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcblxuICAgICAgICBsZXQgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgICAgIG9yYml0Q29udHJvbHMudGFyZ2V0LnNldCgwLCAxMCwgMCk7XG4gICAgICAgIG9yYml0Q29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLyAyO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgeCA6ICR7Y2FtZXJhLnBvc2l0aW9uLnh9LCB5IDogJHtjYW1lcmEucG9zaXRpb24ueX0sIHogOiAke2NhbWVyYS5wb3NpdGlvbi56fWApO1xuXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIGxldCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSkubm9ybWFsaXplKCk7XG4gICAgICAgIHRoaXMubGlnaHQucG9zaXRpb24uc2V0KGx2ZWMueCwgbHZlYy55LCBsdmVjLnopO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICBsZXQgbG9hZE9CSiA9IChvYmpGaWxlUGF0aDogc3RyaW5nLCBtdGxGaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEO1xuICAgICAgICAgICAgY29uc3QgbXRsTG9hZGVyID0gbmV3IE1UTExvYWRlcigpO1xuICAgICAgICAgICAgbXRsTG9hZGVyLmxvYWQobXRsRmlsZVBhdGgsIChtYXRlcmlhbCkgPT4ge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnByZWxvYWQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmpMb2FkZXIgPSBuZXcgT0JKTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgb2JqTG9hZGVyLnNldE1hdGVyaWFscyhtYXRlcmlhbCk7XG4gICAgICAgICAgICAgICAgb2JqTG9hZGVyLmxvYWQob2JqRmlsZVBhdGgsIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFkZChvYmopO1xuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1lc2ggPSBsb2FkT0JKKFwiL1RyZWUub2JqXCIsIFwiL1RyZWUubXRsXCIpXG4gICAgICAgIG1lc2guc2NhbGUuc2V0KDIsIDIsIDIpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoKTtcblxuICAgICAgICBsZXQgZ2VuZXJhdGVTcHJpdGUgPSAoY29sb3I6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgLy/mlrDjgZfjgYTjgq3jg6Pjg7Pjg5Djgrnjga7kvZzmiJBcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IDE2O1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IDE2O1xuXG4gICAgICAgICAgICAvL+WGhuW9ouOBruOCsOODqeODh+ODvOOCt+ODp+ODs+OBruS9nOaIkFxuICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGxldCBncmFkaWVudCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoY2FudmFzLndpZHRoIC8gMiwgY2FudmFzLmhlaWdodCAvIDIsIDAsIGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyLCBjYW52YXMud2lkdGggLyAyKTtcbiAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiKDE1NSwgMTU1LCAxNTUpJyk7XG4gICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC44LCBjb2xvcik7XG4gICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMSknKTtcblxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIC8v44OG44Kv44K544OB44Oj44Gu55Sf5oiQXG4gICAgICAgICAgICBsZXQgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcyk7XG4gICAgICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0dXJlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFydGljbGVOdW0gPSAxMDAwMDtcblxuICAgICAgICBsZXQgc2FrdXJhUG9zaXRpb24gPSAocG9zaXRpb25zOiBGbG9hdDMyQXJyYXksIHBhcnRpY2xlSW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgbGV0IHNha3VyYVJhbjEgPSAyICogTWF0aC5QSSAqIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBsZXQgc2FrdXJhUmFuMiA9IE1hdGguYWNvcygyICogTWF0aC5yYW5kb20oKSAtIDEpO1xuICAgICAgICAgICAgbGV0IHNha3VyYVIgPSAyMCAqIE1hdGguY2JydChNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgIGxldCB4ID0gc2FrdXJhUiAqIE1hdGguc2luKHNha3VyYVJhbjIpICogTWF0aC5jb3Moc2FrdXJhUmFuMSkgKiAxLjU7IC8vIHjluqfmqJlcbiAgICAgICAgICAgIGxldCB6ID0gc2FrdXJhUiAqIE1hdGguY29zKHNha3VyYVJhbjIpICogMS41OyAvLyB65bqn5qiZXG4gICAgICAgICAgICBsZXQgeSA9IHNha3VyYVIgKiBNYXRoLnNpbihzYWt1cmFSYW4yKSAqIE1hdGguc2luKHNha3VyYVJhbjEpICsgMzUgLSBNYXRoLnNxcnQoeCAqIHggKyB6ICogeikgLyAzOyAvLyB55bqn5qiZXG4gICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCAqIDNdID0geDtcbiAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4ICogMyArIDFdID0geTtcbiAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4ICogMyArIDJdID0gejtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IGNyZWF0ZVBhcnRpY2xlcyA9IChjb2xvcjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAvL+OCuOOCquODoeODiOODquOBruS9nOaIkFxuICAgICAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgICAgICAvL+ODnuODhuODquOCouODq+OBruS9nOaIkFxuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgICAgIGNvbG9yOiAweGZmZmZmZixcbiAgICAgICAgICAgICAgICBzaXplOiAwLjUsXG4gICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWFwOiBnZW5lcmF0ZVNwcml0ZShjb2xvcilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvL3BhcnRpY2xl44Gu5L2c5oiQXG4gICAgICAgICAgICBsZXQgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShwYXJ0aWNsZU51bSAqIDMpO1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlTnVtOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzYWt1cmFQb3NpdGlvbihwb3NpdGlvbnMsIGkpO1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC4yKSB7IC8v5pyo44Gr44GP44Gj44Gk44GE44Gm44KL6Iqx44Gz44KJXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVWZWxvY2l0eVtpXSA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy/okL3kuIvkuK3jga7oirHjgbPjgolcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgLSAxLjEpICogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC0xXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykgeyAvL+WLleOBj+WJjeOBi+OCieiQveOBoeOBpuOBhOOCi+OCiOOBhuOBq1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnNbaSAqIDMgKyAxXSArPSB0aGlzLnBhcnRpY2xlVmVsb2NpdHlbaV0ueTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zW2kgKiAzICsgMl0gKz0gdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldLno7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKTtcbiAgICAgICAgICAgIC8vVEhSRUUuUG9pbnRz44Gu5L2c5oiQXG4gICAgICAgICAgICB0aGlzLmNsb3VkID0gbmV3IFRIUkVFLlBvaW50cyhnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgLy/jgrfjg7zjg7Pjgbjjga7ov73liqBcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2xvdWQpXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVBhcnRpY2xlcygncmdiYSgyNTUsIDEzOCwgMjMwLCAxKScpO1xuXG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IDEwMDtcblxuICAgICAgICBsZXQgcmFuMSA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEwMCArIDIgKiByYWRpdXM7XG4gICAgICAgIGxldCByYW4yID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMTAwICsgMiAqIHJhZGl1cztcbiAgICAgICAgbGV0IHJhbjMgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAxMDAgKyAyICogcmFkaXVzO1xuICAgICAgICBsZXQgcmFuNCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEwMCArIDIgKiByYWRpdXM7XG4gICAgICAgIGxldCByYW41ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMTAwICsgMiAqIHJhZGl1cztcbiAgICAgICAgbGV0IHJhbjYgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAxMDAgKyAyICogcmFkaXVzO1xuXG4gICAgICAgIGxldCBURVJSQUlOID0gKHU6IG51bWJlciwgdjogbnVtYmVyLCB0YXJnZXQ6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRoZXRhID0gdSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICAgICAgY29uc3QgciA9IHYgKiByYWRpdXM7XG4gICAgICAgICAgICBjb25zdCB4ID0gciAqIE1hdGguY29zKHRoZXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHogPSByICogTWF0aC5zaW4odGhldGEpO1xuICAgICAgICAgICAgbGV0IHkxID0gMiAqIE1hdGguc2luKE1hdGguc3FydCgoeCAtIHJhbjEpICogKHggLSByYW4xKSArICh6IC0gcmFuMikgKiAoeiAtIHJhbjIpKSAvIDEwKTtcbiAgICAgICAgICAgIGxldCB5MiA9IE1hdGguc2luKE1hdGguc3FydCgoeCAtIHJhbjMpICogKHggLSByYW4zKSArICh6IC0gcmFuNCkgKiAoeiAtIHJhbjQpKSAvIDgpO1xuICAgICAgICAgICAgbGV0IHkzID0gTWF0aC5zaW4oTWF0aC5zcXJ0KCh4IC0gcmFuNSkgKiAoeCAtIHJhbjUpICsgKHogLSByYW42KSAqICh6IC0gcmFuNikpIC8gNSk7XG4gICAgICAgICAgICBsZXQgeSA9IDA7XG4gICAgICAgICAgICBjb25zdCBUID0gMTA7XG4gICAgICAgICAgICBjb25zdCBmbGF0UiA9IE1hdGguUEk7XG4gICAgICAgICAgICBjb25zdCB3YXZlRW5kUiA9IDIgKiBUICogTWF0aC5QSTtcbiAgICAgICAgICAgIGlmIChyID4gd2F2ZUVuZFIpIHtcbiAgICAgICAgICAgICAgICB5ID0gMyAqIE1hdGguY29zKHdhdmVFbmRSIC8gVCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHIgPiBmbGF0Uikge1xuICAgICAgICAgICAgICAgIHkgPSAzICogTWF0aC5jb3MociAvIFQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB5ID0gMyAqIE1hdGguY29zKGZsYXRSIC8gVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5ICs9ICh5MSArIHkyICsgeTMpIC8gNTtcbiAgICAgICAgICAgIHRhcmdldC5zZXQoeCwgeSwgeik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QYXJhbWV0cmljR2VvbWV0cnkoVEVSUkFJTiwgMTAwLCA1MCk7XG5cbiAgICAgICAgLy8g6aCC54K55pWwXG4gICAgICAgIGNvbnN0IGNvdW50ID0gZ2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbi5jb3VudDtcblxuICAgICAgICAvLyDoibLphY3liJcgKHIsIGcsIGIpIOOCkumggueCueaVsCDDlyAz44GuRmxvYXQzMkFycmF544Gn55So5oSPXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkoY291bnQgKiAzKTtcblxuICAgICAgICAvLyBnZW9tZXRyeeOBq2NvbG9y5bGe5oCn44KS44K744OD44OIXG4gICAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZSgnY29sb3InLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGNvbG9ycywgMykpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IGdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb247XG4gICAgICAgIGNvbnN0IG1pblkgPSAtMztcbiAgICAgICAgY29uc3QgbWF4WSA9IDM7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB5ID0gcG9zaXRpb25zLmdldFkoaSk7XG4gICAgICAgICAgICBjb25zdCB0ID0gKHkgLSBtaW5ZKSAvIChtYXhZIC0gbWluWSk7ICAvLyAw44CcMeOBq+ato+imj+WMllxuXG4gICAgICAgICAgICAvLyDojLboibIgIOOBi+OCiSDnt5HoibIgIOOBuOOBruijnOmWk1xuICAgICAgICAgICAgY29uc3QgciA9IDAuNiAqICgxIC0gdCkgKyAwLjMgKiB0O1xuICAgICAgICAgICAgY29uc3QgZyA9IDAuNiAqICgxIC0gdCkgKyAwLjcgKiB0O1xuICAgICAgICAgICAgY29uc3QgYiA9IDAuNCAqICgxIC0gdCkgKyAwLjIgKiB0O1xuXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDNdID0gcjtcbiAgICAgICAgICAgIGNvbG9yc1tpICogMyArIDFdID0gZztcbiAgICAgICAgICAgIGNvbG9yc1tpICogMyArIDJdID0gYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbiAgICAgICAgICAgIHZlcnRleENvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICBzaGluaW5lc3M6IDEwLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgb3BhY2l0eTogMC42LFxuICAgICAgICAgICAgZmxhdFNoYWRpbmc6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0ZXJyYWluID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGVycmFpbik7XG5cbiAgICAgICAgbGV0IHQgPSAwO1xuXG4gICAgICAgIGxldCBXQVRFUiA9ICh1OiBudW1iZXIsIHY6IG51bWJlciwgdGFyZ2V0OiBUSFJFRS5WZWN0b3IzKSA9PiB7IH1cbiAgICAgICAgbGV0IHBhcmFtR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGFyYW1ldHJpY0dlb21ldHJ5KFdBVEVSLCAxMDAsIDEwMCk7XG4gICAgICAgIGxldCBwYXJhbU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiAweDAwZmZmZixcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNSxcbiAgICAgICAgICAgIHNoaW5pbmVzczogMTAwLFxuICAgICAgICAgICAgc3BlY3VsYXI6IDB4ZmZmZmZmLFxuICAgICAgICAgICAgZmxhdFNoYWRpbmc6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCB3YXRlciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgICB3YXRlci5hZGQobmV3IFRIUkVFLk1lc2gocGFyYW1HZW9tZXRyeSwgcGFyYW1NYXRlcmlhbCkpO1xuXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHdhdGVyKTtcblxuICAgICAgICAvL3RlcnJhaW4udmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAvL3dhdGVyLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIzmm7TmlrBcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcblxuICAgICAgICAgICAgLy/moZxcbiAgICAgICAgICAgIGNvbnN0IGdlb20gPSA8VEhSRUUuQnVmZmVyR2VvbWV0cnk+dGhpcy5jbG91ZC5nZW9tZXRyeTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IGdlb20uZ2V0QXR0cmlidXRlKCdwb3NpdGlvbicpOyAvLyDluqfmqJnjg4fjg7zjgr9cbiAgICAgICAgICAgIGNvbnN0IGRlbHRhVGltZSA9IGNsb2NrLmdldERlbHRhKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFooaSwgcG9zaXRpb25zLmdldFooaSkgKyB0aGlzLnBhcnRpY2xlVmVsb2NpdHlbaV0ueiAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFkoaSwgcG9zaXRpb25zLmdldFkoaSkgKyB0aGlzLnBhcnRpY2xlVmVsb2NpdHlbaV0ueSAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9ucy5nZXRZKGkpIDwgLTUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2FrdXJhUG9zaXRpb24ocG9zaXRpb25zLmFycmF5IGFzIEZsb2F0MzJBcnJheSwgaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zaXRpb25zLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuXG4gICAgICAgICAgICAvL+awtFxuICAgICAgICAgICAgdCArPSAwLjA1O1xuICAgICAgICAgICAgY29uc3QgcG9zQXR0ciA9IHBhcmFtR2VvbWV0cnkuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XG4gICAgICAgICAgICBjb25zdCBwb3NBcnJheSA9IHBvc0F0dHIuYXJyYXkgYXMgRmxvYXQzMkFycmF5O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NBdHRyLmNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1ID0gKGkgJSAxMDEpIC8gMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBNYXRoLmZsb29yKGkgLyAxMDEpIC8gMTAwO1xuICAgICAgICAgICAgICAgIGxldCByID0gMTAwO1xuICAgICAgICAgICAgICAgIGxldCB4ID0gdSAqIHIgLSByIC8gMjtcbiAgICAgICAgICAgICAgICBsZXQgeiA9IHYgKiByIC0gciAvIDI7XG4gICAgICAgICAgICAgICAgbGV0IHkxID0gTWF0aC5zaW4oTWF0aC5zcXJ0KCh4IC0gcmFuMSkgKiAoeCAtIHJhbjEpICsgKHogLSByYW4yKSAqICh6IC0gcmFuMikpIC8gMiAtIHQgLyAyKTtcbiAgICAgICAgICAgICAgICBsZXQgeTIgPSBNYXRoLnNpbihNYXRoLnNxcnQoKHggLSByYW4zKSAqICh4IC0gcmFuMykgKyAoeiAtIHJhbjQpICogKHogLSByYW40KSkgLyAyIC0gdCAvIDMpO1xuICAgICAgICAgICAgICAgIGxldCB5MyA9IE1hdGguc2luKE1hdGguc3FydCgoeCAtIHJhbjUpICogKHggLSByYW41KSArICh6IC0gcmFuNikgKiAoeiAtIHJhbjYpKSAtIHQgLyA0KTtcbiAgICAgICAgICAgICAgICBwb3NBcnJheVtpICogMyArIDBdID0geDtcbiAgICAgICAgICAgICAgICBwb3NBcnJheVtpICogMyArIDFdID0gKHkxICsgeTIgKyB5MykgLyAzMDtcbiAgICAgICAgICAgICAgICBwb3NBcnJheVtpICogMyArIDJdID0gejtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc0F0dHIubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgcGFyYW1HZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xuXG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMygtNjUsIDEwLCAtMjUpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYml0Q29udHJvbHNfanMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzLTVlZjMzY1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==