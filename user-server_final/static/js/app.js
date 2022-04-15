/*
 *  作者: 行歌
 *  微信公众号: 码语派
 */

let camera, renderer, scene
let controls
let pointLight1, pointLight2, pointLight3
let pointLight4, pointLight5, pointLight6
let pointLight7
let ambientLight
let ceilingLight
let clock = new THREE.Clock()
let paths = ''


let player, activeCamera
let speed = 6 //移动速度
let turnSpeed = 2
let move = {
  forward: 0,
  turn: 0
}

let colliders = [] //碰撞物
let gallerys = [] //画廊模型
let debugMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})
let draws = []

let arrowHelper1, arrowHelper2
let joystick //移动设备控制器

let control, gui

function init() {

  createScene()
  createObjects()
  createColliders()
  createPlayer()
  createCamera()
  createLights()
  //createLightHelpers()
  createControls()
  createEvents()
  //createJoyStick()
  createMenu()
  render()
}

function createMenu() {
  control = new function () {
    this.blueTile = function () {
      //scene.remove(gallerys)
      clearScene()
      paths='../static/model/galleryInBlueTile.glb'
      createObjects(paths)
    }
    this.blueTexture = function () {
      //scene.remove(gallerys)
      clearScene()
      paths='../static/model/galleryInGreenTexture.glb'
      createObjects(paths)
    }
    this.greyTile = function () {
      //scene.remove(gallerys)
      clearScene()
      paths='../static/model/galleryInGreyTile.glb'
      createObjects(paths)
    }
    this.redTexture = function () {
      //scene.remove(gallerys)
      clearScene()
      paths='../static/model/galleryInRedTexture.glb'
      createObjects(paths)
    }
    this.lightTexture = function () {
      //scene.remove(gallerys)
      clearScene()
      paths='../static/model/galleryInLightTexture.glb'
      createObjects(paths)
    }
    this.brick = function () {
      //scene.remove(gallerys)
      clearScene()
      paths='../static/model/galleryInBrick.glb'
      createObjects(paths)
    }
  }
  gui = new dat.GUI()
  gui.add(control, 'blueTile').name('蓝调风格')
  gui.add(control, 'blueTexture').name('青调风格')
  gui.add(control, 'greyTile').name('灰调风格')
  gui.add(control, 'redTexture').name('中国风')
  gui.add(control, 'lightTexture').name('欧式风')
  gui.add(control, 'brick').name('砖墙风格')
}


function clearScene(){
	// 从scene中删除模型并释放内存
	if(gallerys.length > 0){		
		for(var i = 0; i< gallerys.length; i++){
			var currObj = gallerys[i];
			// 判断类型
			if(currObj instanceof THREE.Scene){
				var children = currObj.children;
				for(var i = 0; i< children.length; i++){
					deleteGroup(children[i]);
				}	
			}else{				
				deleteGroup(currObj);
			}
			scene.remove(currObj);
		}
	}
}

// 删除group，释放内存
function deleteGroup(group) {
	//console.log(group);
    if (!group) return;
    // 删除掉所有的模型组内的mesh
    group.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); // 删除几何体
            item.material.dispose(); // 删除材质
        }
    });
}

function createJoyStick() {//虚拟摇杆控件
  joystick = new JoyStick({
    onMove: function (forward, turn) {
      turn = -turn
      if (Math.abs(forward) < 0.3) forward = 0
      if (Math.abs(turn) < 0.1) turn = 0
      move.forward = forward
      move.turn = turn
    }
  })
}

function createEvents() {
  document.addEventListener('keydown', onKeyDown)//用户按下一个键盘按键时
  document.addEventListener('keyup', onKeyUp)//在键盘按键被松开时发生
  document.addEventListener('mousemove', onmousemove)//移过
  document.addEventListener('mousedown', onmousedown)//按下
}

function createColliders() {//碰撞体积
  const loader = new THREE.GLTFLoader()//加载器
  loader.load(
    '../static/model/collider.glb',//加载碰撞模型
    gltf => {
      gltf.scene.traverse(child => {
        if (child.name.includes('collider')) {
          colliders.push(child)
        }
      })
      colliders.forEach(item => {
        item.visible = false//隐藏模型
        scene.add(item)
      })
    }
  )

}

function onKeyDown(event) {//按下前后左右和WASD按钮
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      move.forward = 1
      break

    case 'ArrowLeft':
    case 'KeyA':
      move.turn = turnSpeed
      break

    case 'ArrowDown':
    case 'KeyS':
      move.forward = -1
      break

    case 'ArrowRight':
    case 'KeyD':
      move.turn = -turnSpeed
      break
    case 'Space':
      break
  }
}

function onKeyUp(event) {//松开即停止
  switch (event.code) {

    case 'ArrowUp':
    case 'KeyW':
      move.forward = 0
      break

    case 'ArrowLeft':
    case 'KeyA':
      move.turn = 0
      break

    case 'ArrowDown':
    case 'KeyS':
      move.forward = 0
      break

    case 'ArrowRight':
    case 'KeyD':
      move.turn = 0
      break

  }
}

function createPlayer() {
  const geometry = new THREE.BoxGeometry(1, 2, 1)//创建长方体
  const material = new THREE.MeshBasicMaterial({// 这种材质不考虑场景中光照的影响
    color: 0xff0000,//材质颜色为红色
    wireframe: true //将材质渲染成线框
  })
  player = new THREE.Mesh(geometry, material)//根据物体类型和材料生成网格模型
  player.name = 'player'
  geometry.translate(0, 1, 0)
  player.position.set(-5, 0, 5)//调整位置
  //scene.add(player)//将网格模型添加到场景中
}

function createCamera() {
  const back = new THREE.Object3D()
  back.position.set(0, 2, 1)
  back.parent = player
  //player.add(back)
  activeCamera = back
}

function createScene() {
  renderer = new THREE.WebGLRenderer({// 创建渲染对象
    antialias: false//不执行抗锯齿
  })
  renderer.outputEncoding = THREE.sRGBEncoding  //输出编码方式
  renderer.setSize(window.innerWidth, window.innerHeight)// 设置渲染区域尺寸
  renderer.setPixelRatio(window.devicePixelRatio)// 设置显示比例
  // renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap

  camera = new THREE.PerspectiveCamera(//透视相机
    60,//能够看到的角度范围
    window.innerWidth / window.innerHeight, //渲染窗口的长宽比
    0.1, //从距离相机多远开始渲染
    5000)//从距离相机多远截止渲染，大一点避免部分场景看不到
  camera.position.set(-10, 2, 10)//相机的摆放位置
  //设置场景scene
  scene = new THREE.Scene()
  const container = document.querySelector('#container')//获取文档中id="container"的元素，也就是所设置的div
  container.appendChild(renderer.domElement)//container追加渲染对象结点

  window.addEventListener('resize', onResize)//实时监听窗口变化
}

function createLights() {
  ambientLight = new THREE.AmbientLight(//环境光，没有特定方向的光源，均匀整体改变物体表面的明暗效果
    0xe0ffff, 0.6)//蓝白色，强度为0.6
  scene.add(ambientLight)

  pointLight1 = new THREE.PointLight(0xe0ffff, 0.1, 20) //点光源，颜色，强度，距离
  pointLight1.position.set(-2, 3, 2)//灯光位置设置
  scene.add(pointLight1)

  pointLight2 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight2.position.set(0, 3, -6)
  scene.add(pointLight2)

  pointLight3 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight3.position.set(-12, 3, 6)
  scene.add(pointLight3)

  pointLight4 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight4.position.set(-12, 4, -4)
  scene.add(pointLight4)

  pointLight5 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight5.position.set(12, 4, -8)
  scene.add(pointLight5)

  pointLight6 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight6.position.set(12, 4, 0)
  scene.add(pointLight6)

  pointLight7 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight7.position.set(12, 4, 8)
  scene.add(pointLight7)

  // ceilingLight = new THREE.RectAreaLight(0xe0ffff, 0.2 , 40, 40)//矩形光，宽度和长度
  // ceilingLight.position.set(-2, 5.6, 2)
  // ceilingLight.lookAt( -2, 2, 2 )//平面光光源指向的中心位置，指向下方
  // scene.add(ceilingLight)
  // const rectHelper = new THREE.RectAreaLightHelper(ceilingLight);//添加一个虚拟体，可视化灯光体
  // scene.add(rectHelper)
  // var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( {color:'#ffffff' ,side: THREE.BackSide } ) )
  // rectLightMesh.scale.x = ceilingLight.width
  // rectLightMesh.scale.y = ceilingLight.height
  // ceilingLight.add( rectLightMesh );
  // rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );
  // rectLightMesh.add( rectLightMeshBack );

}

function createLightHelpers() {//创建虚拟球形来模拟点光源
  //要模拟的对应光源，尺寸为1
  const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1)
  scene.add(pointLightHelper1)

  const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1)
  scene.add(pointLightHelper2)

  const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1)
  scene.add(pointLightHelper3)

  const pointLightHelper4 = new THREE.PointLightHelper(pointLight4, 1)
  scene.add(pointLightHelper4)

  const pointLightHelper5 = new THREE.PointLightHelper(pointLight5, 1)
  scene.add(pointLightHelper5)

  const pointLightHelper6 = new THREE.PointLightHelper(pointLight6, 1)
  scene.add(pointLightHelper6)

  const pointLightHelper7 = new THREE.PointLightHelper(pointLight7, 1)
  scene.add(pointLightHelper7)
}

function createControls() {//轨道控制器
  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.enablePan = false;//禁止鼠标右键平移
  controls.enableZoom = false;//禁止鼠标中键缩放场景
  controls.enableRotate = false;//禁止鼠标左键旋转场景
  controls.minZoom = 0.5;//缩放范围
  controls.maxZoom = 2;
  // 上下旋转范围
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;
  // 左右旋转范围
  controls.minAzimuthAngle = -Math.PI * (100 / 180);
  controls.maxAzimuthAngle = Math.PI * (100 / 180);
  controls.target.set(0, 0, 0);//旋转中心点
  controls.update();
}


function createObjects(paths) {//创建画廊对象
  if (paths == null) {
    paths = '../static/model/galleryInLightTexture.glb'
  }
  const loader = new THREE.GLTFLoader()
  loader.load(
    paths,
    gltf => {
      gltf.scene.traverse(child => {
        gallerys.push(child)
        switch (child.name) {
          case 'walls'://墙壁
            initWalls(child)
            break
          case 'ceiling'://天花板
            initCeiling(child)
            break
          
        }
        //设置展画边框贴图
        if (child.name.includes('paint')) {//根据元素名paint设置边框贴图 里面那层
          initFrames(child)
        }
        //设置展画图片贴图
        if (child.name.includes('draw')) {//根据元素名draw设置图片贴图 外面那层
          initDraws(child)
        }
      })
      scene.add(gltf.scene)
    }
  )
}



function initDraws(child) {
  child.material = new THREE.MeshStandardMaterial({//物理材质
    color: 0xF5F5DC//
  })
  draws.push(child)
  const index = child.name.split('draw')[1]
  const texture = new THREE.TextureLoader().load(`../static/img/${index}.jpg`)//加载图片index在模型中的索引
  texture.encoding = THREE.sRGBEncoding//在导入材质时,会默认将贴图编码格式定义为Three.LinearEncoding,故需将带颜色信息的贴图ng，故需将带颜色信息的贴图(baseColorTexture, emissiveTexture, 和 specularGlossinessTexture)手动指定为Three.sRGBEncoding
  texture.flipY = false//不旋转图像的y轴，以避免图片颠倒
  const material = new THREE.MeshPhongMaterial({//创建一种光亮表面的材质效果
    map: texture
  })
  child.material = material
}

function initFrames(child) {
  child.material = new THREE.MeshBasicMaterial({//这种材质不考虑场景中光照的影响
    color: 0x7f5816//褐色
  })
}

function initStairs(child) {
  child.material = new THREE.MeshStandardMaterial({//物理材质
    color: 0xd1cdb7//浅黄色
  })
  child.material.roughness = 0.5//粗糙度贴图，即光漫射的表面不规则状况，0为光滑1为粗糙
  child.material.metalness = 0.6//金属贴图，0为绝缘体1为金属体
}

function initWalls(child) {
  child.material = new THREE.MeshStandardMaterial({//物理材质
    color: 0xFDF5E6//浅黄色
  })
  child.material.roughness = 0.5
  child.material.metalness = 0.6
}

function initCeiling(child) {
  if(paths =='../static/model/galleryInRedTexture.glb'){
    child.material = new THREE.MeshStandardMaterial({//物理材质
      color: 0x322B23})
  }
  else{
    child.material = new THREE.MeshStandardMaterial({//物理材质
      color: 0xF5F5DC})
  }
  child.material.roughness = 0.5
  child.material.metalness = 0.5
}

function onResize() {
  const w = window.innerWidth
  const h = window.innerHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()//手动更新相机的投影矩阵
  renderer.setSize(w, h)
}

function render() {
  const dt = clock.getDelta()//获得前后两次执行该方法的时间间隔
  update(dt)
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)//重绘
}

function update(dt) {
  updatePlayer(dt)
  updateCamera(dt)
}

function updatePlayer(dt) {

  const pos = player.position.clone()//返回一个拷贝的相机
  pos.y += 2//y即垂直方向上升
  let dir = new THREE.Vector3()//定义向量来表示点

  player.getWorldDirection(dir)//返回一个世界坐标中,相机观看的方向的向量
  dir.negate()//返回该对象的负值

  if (move.forward < 0) dir.negate()//如果后退则返回负值
  let raycaster = new THREE.Raycaster(pos, dir)//光线投射，pos是射线起点，dir是射线方向
  let blocked = false
  //射线raycast以防止穿墙，从正前方向创建一条射线，当射线与障碍物的距离小于1时停止移动
  if (colliders.length > 0) {
    const intersect = raycaster.intersectObjects(colliders)//检查射线和碰撞体积是否相交，并返回第一个相交的几何体。
    if (intersect.length > 0) { //选中第一个射线相交的物体
      if (intersect[0].distance < 1.5) {//发生碰撞时
        blocked = true//标记已碰撞
      }
    }
  }

  // if(colliders.length > 0) {
  //   //左方向碰撞监测
  //   dir.set(-1, 0, 0)
  //   dir.applyMatrix4(player.matrix)
  //   dir.normalize()
  //   raycaster = new THREE.Raycaster(pos, dir)

  //   let intersect = raycaster.intersectObjects(colliders)
  //   if(intersect.length > 0) {
  //     if(intersect[0].distance < 2) {
  //       player.translateX(2 - intersect[0].distance)
  //     }
  //   }

  //   //右方向碰撞监测
  //   dir.set(1, 0, 0)
  //   dir.applyMatrix4(player.matrix)
  //   dir.normalize()
  //   raycaster = new THREE.Raycaster(pos, dir)

  //   intersect = raycaster.intersectObjects(colliders)
  //   if(intersect.length > 0) {
  //     if(intersect[0].distance < 2) {
  //       player.translateX(intersect[0].distance - 2)
  //     }
  //   }
  // }

  if (!blocked) {//未碰撞时
    if (move.forward !== 0) {
      if (move.forward > 0) { //方向向前
        player.translateZ(-dt * speed)  //前进
      } else {//后退
        player.translateZ(dt * speed * 0.4)//速度慢一点
      }
    }
  }

  if (move.turn !== 0) {
    player.rotateY(move.turn * dt)
  }
}

function updateCamera(dt) {//
  camera.position.lerp(//用插值函数来过渡摄像机来平滑跟随
    //摄像机始终同步跟踪坐标
    activeCamera.getWorldPosition(new THREE.Vector3()), 0.08//返回值就是靠近from端的一个点，from到这个点的长度为线段的0.08
  )
  const pos = player.position.clone()
  pos.y += 2
  camera.lookAt(pos)
}
//因为LookAt并不平滑，没有插值过程，你每次移动之后重新看向物体，不就抖动了嘛。解决的话，自己写一个类似lookat平滑看向物体的方法
//此问题尚未解决

function onmousedown(event) {
  var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
  vector = vector.unproject(camera); // 将屏幕的坐标转换成三维场景中的坐标
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());// 创建光线投射，计算出鼠标移过了什么物体
  var intersects = raycaster.intersectObjects(draws);
  if (intersects.length > 0) {
    if (intersects[0].object.name == draws[0].name) {
      alert(1)
    }
    if (intersects[0].object.name == draws[1].name) {
      alert(2)
    }
    if (intersects[0].object.name == draws[2].name) {
      alert(3)
    }
    if (intersects[0].object.name == draws[3].name) {
      alert(4)
    }
    if (intersects[0].object.name == draws[4].name) {
      alert(5)
    }
    if (intersects[0].object.name == draws[5].name) {
      alert(6)
    }
    if (intersects[0].object.name == draws[6].name) {
      alert(7)
    }
    if (intersects[0].object.name == draws[7].name) {
      alert(8)
    }
    if (intersects[0].object.name == draws[8].name) {
      alert(9)
    }
    if (intersects[0].object.name == draws[9].name) {
      alert(10)
    }
    if (intersects[0].object.name == draws[10].name) {
      alert(11)
    }
    if (intersects[0].object.name == draws[11].name) {
      alert(12)
    }
    if (intersects[0].object.name == draws[12].name) {
      alert(13)
    }

  }
}


init()