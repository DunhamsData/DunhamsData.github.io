// Remove video if testing locally
if (window.location.href.includes('home/antonio'))
  $('iframe').remove()

// &#9202;   clock
// &#128392; map-marker

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isLightScheme = urlParams.get('scheme') === 'dark' ? false : true // dark, light
const isSideTour = urlParams.get('tour') === 'tooltip' ? false : true // tooltip, sidepanel

if (!isLightScheme) {
  document.body.classList.add('dark')
  const icons = document.getElementsByClassName('icon')
  for (var i=0; i<icons.length; i++) {
    var icon = icons[i]
    icon.classList.add('dark')
  }
}

// Params
const lightGlobeImage = 'earth-maps/light_gray_HD.png'
const darkGlobeImage = 'earth-maps/dark_gray_HD.png'
const lightBackgroundColor = '#ffffff'
const darkBackgroundColor = '#1a1a1a'
const lightPoleColor = '#ffffffee' // for dark scheme
const darkPoleColor = '#00000080' // for light scheme

var globeImage = isLightScheme ? lightGlobeImage : darkGlobeImage
var poleColor = isLightScheme ? darkPoleColor : lightPoleColor
var backgroundColor = isLightScheme ? lightBackgroundColor : darkBackgroundColor

const params = {
  globe: {
    wrapImages: [
      lightGlobeImage,
      'earth-maps/new-base-maps/grey1.png',
      'earth-maps/new-base-maps/grey2.png',
      'earth-maps/new-base-maps/grey3.png',
      'earth-maps/new-base-maps/grey4.png',
      darkGlobeImage,
    ],
    backgroundColors: [
      lightBackgroundColor,
      darkBackgroundColor,
    ],
  },
  point: { // visible pole
    colors: [
      darkPoleColor,
      lightPoleColor,
    ],
    //color: darkPoleColor,
    color: poleColor,
    hexColor: null, // #808080
    opacity: null, // 0.4
    radius: 0.01,
  },
  point2: { // hidden highlightable pole
    color: '#00000000',
    hexColor: null, // #000000
    opacity: null, // 0
//    highColor: '#404040CC',
    highColor: darkPoleColor,
    highHexColor: null, // #00FFFF
    highOpacity: null, // 0.8
    radius: 0.1,
  },
  labelCity: {
    color: isLightScheme ? '#333333FF' : '#f0f0f0FF',
    hexColor: null, // #333333
    opacity: null, // 1
    size: 0.15,
    highColor: '#FF5000FF',
    highHexColor: null, // #FF5000
    highOpacity: null, // 1
  },
  labelCityBckg: {
    color: '#00000000',
    hexColor: null, // #000000
    opacity: null, // 0
    size: 3,
  },
  labelYear: {
    color: isLightScheme ? '#808080CC': '#c0c0c0cc',
    hexColor: null, // #808080
    opacity: null, // 0.8
    size: 0.1,
  },
  path: { // thick colored visible line
    color: 'color',
    stroke: 0.15, // 0.35, // 0.15,
    highHexColor: '#FF00FF',
    highStroke: 1,
  },
  path2: { // thin hidden line
    dashLength: 1,
    dashGap: 0.5,
    dashAnimateTime: 500,
    colorOff: '#FFFFFF00',
    colorOn: '#FFFFFFFF',
  },
  dot: { // no opacity allowed
    sphereColor: '#008000',
    sphereRGBColor: null, // {r:0, g:0.5019607843137255, b:0}
    sphereRadius: 0.03, // 0.05,
    sphereRadiusScale: 11,
    hSphereColor: '#000000',
    hSphereRGBColor: '#00FFFF', // null, // {r:0, g:0, b:0}
    hSphereRadiusScale: 22,
    tickColor: '#808080',
    tickRadius: 0.01, //0.1,
    highSphereColor: '#ff8000',
  },
  light: {
    position: 'right',
    intensity: 0.6,
    aIntensity: 1.5,
  }
}
for (k in params) {
    var objParams = params[k]
    if ('hexColor' in objParams && 'opacity' in objParams && 'color' in objParams)
        [objParams['hexColor'], objParams['opacity']] = hexa2hexAndAlpha(objParams['color'])
    if ('highHexColor' in objParams && 'highOpacity' in objParams && 'highColor' in objParams)
        [objParams['highHexColor'], objParams['highOpacity']] = hexa2hexAndAlpha(objParams['highColor'])
    if ('sphereRGBColor' in objParams && 'sphereColor' in objParams)
        objParams['sphereRGBColor'] = hex2rgbNorm(objParams['sphereColor'])
    if ('hSphereRGBColor' in objParams && 'hSphereColor' in objParams)
        objParams['hSphereRGBColor'] = hex2rgbNorm(objParams['hSphereColor'])
}




// Important values
const globeDiv = document.getElementById('globeViz')
const globe = Globe()(globeDiv)
const scene = globe.scene()
const camera = globe.camera()
const controls = globe.controls()
const renderer = globe.renderer()
var pointsD, labelsD, pathsD, paths2D, dotsD
const initLoc = { lat: 10, lng: -88.16, altitude: 10 } // Joliet
const basicTravelTransition = 2000
const restartTransition = basicTravelTransition * 2
const jumpTransition = basicTravelTransition
const tourTransition = basicTravelTransition * 4
const LAT = 10
var is5053 = false
var scrollInRange = true
var hideDescTimeout
var myPathsData

const mainRect = document.getElementById('main-content').getBoundingClientRect()
const INIT_WIDTH = mainRect.width // 1280
const INIT_HEIGHT = mainRect.height // 720
const WIDTH =  INIT_HEIGHT * 4 // same width as height to make it square
const HEIGHT = INIT_HEIGHT * 4

//const canvas = document.querySelector('#globeViz canvas');
//canvas.style.width = `${INIT_WIDTH}px`;
//canvas.style.height = `${INIT_HEIGHT}px`;
//canvas.style.position = 'absolute';
//canvas.style.left = '50%';
//canvas.style.top = '37.5%';
//canvas.style.transform = 'translate(-50%, -37.5%)';

//globe.style.width = `${INIT_WIDTH}px`;
//globe.style.height = `${INIT_HEIGHT}px`;
//globe.style.position = 'absolute';
//globe.style.left = '50%';
//globe.style.top = '50%';
//globe.style.transform = 'translate(-50%, -50%)';


var STATUS
var COLOR
var STATUS_BACKGROUNDCOLOR = 1
    
// Code 1
init()
awaitData()

//window.onmousemove = function(ev) {
//    if (ev.y < 60) {
//    }
//}

// Functions 1
function drawGlobe() {
  //globe.globeImageUrl(params.globe.wrapImages[0])
  globe.globeImageUrl(globeImage)
  //globe.showAtmosphere(!isLightScheme)
  globe.showAtmosphere(false)
  //scene.background = new THREE.Color(params.globe.backgroundColors[0])
  scene.background = new THREE.Color(backgroundColor)
  //document.getElementById('main-content').style.backgroundColor = params.globe.backgroundColors[0]
  document.getElementById('main-content').style.backgroundColor = backgroundColor
}

function init() {
    drawGlobe()
    
    
    const R = (270 - (-90)) / (2 * Math.PI)
    
    //var mleft = window.innerWidth/2
    //var mtop = 50
    //$('#mytooltip').css( { marginLeft : mleft+"px", marginTop : mtop+"px", position: "fixed" } );
    
    //const distThreshold = 2.5
    //var prevAlt = initLoc.altitude <= distThreshold ? 'close' : 'far'
    //var currentAlt
    //function updateLabelSize (altitude) {
    //    currentAlt = altitude <= distThreshold ? 'close' : 'far'
    //    if (currentAlt != prevAlt) {
    //        if (currentAlt == 'close')
    //            globe.labelSize(d => d.type == 'city' ? params.labelCity.closeSize : params.labelYear.size)
    //        else // (currentAlt == 'far')
    //            globe.labelSize(d => d.type == 'city' ? params.labelCity.farSize : params.labelYear.size)
    //        prevAlt = currentAlt
    //    }
    //}
    
    globe
    .width(WIDTH)
    .height(HEIGHT)
    .pointOfView(initLoc, 4000)
    .onZoom(function (loc) {
        if (typeof controls.MOUSE_EVENT !== 'undefined') {
            // Scroll
            // > 0 => scroll down
            // < 0 => scroll up
            if (controls.MOUSE_EVENT.action == 'scroll' && !controls.MOUSE_EVENT.ctrlKey) {
                var deltaY = controls.MOUSE_EVENT.deltaY
                var step = deltaY < 0 ? -1 : 1
                step *= 100
                window.scrollBy(0, step)
            }
            else {
              if (loc.altitude < 9)
                $('#description').removeClass('visible')
              else
                $('#description').addClass('visible')
              
//              if (controls.MOUSE_EVENT.deltaY > 0 && loc.altitude < 9) { // zout && altitude < 9
//                if (controls.target.y < 0) {
//                  controls.target.y = Math.min(controls.target.y + 1, 0)
//                }
//                else if (controls.target.y > 0) {
//                  controls.target.y = Math.max(controls.target.y - 1, 0)
//                }
//                else {
//                  //controls.update()
//                }
//              }
            }
            
            // Reset status
            setTimeout(() => {
                controls.MOUSE_EVENT.action = null
            }, 100);
        }
        
        
        // Flash light holder
        //if (scene.children.length >= 3) {
        //    var sect = ev.lng + 90
        //    var ang = sect / R
        //    var X = R * Math.sin(ang) * (params.light.position == 'left' ? -1 : 1)
        //    var Z = R * Math.cos(ang) * (params.light.position == 'left' ? -1 : 1)
        //    var myLight = scene.children[2]
        //    myLight.position.set(X, 0, Z)
        //}
    })
    .onPointClick(d => {
      if (leftClick)
        clickOnPole(d)
    })
    .onCustomLayerClick(d => {
      if (leftClick)
        clickOnSphere(d)
    })
    .onPointHover((d, prev) => {
      if (!globeInMotion()) {
        if (prev)
          unhoverOnPole(prev)
        if (d)
          hoverOnPole(d)
      }
    })
    .onCustomLayerHover((d, prev) => {
      if (!globeInMotion()) {
        if (prev)
          unhoverOnSphere(prev)
        if (d)
          hoverOnSphere(d)
      }
    })
    .onRightClick(() => {
    })
    
    // Light
    setTimeout(() => {
        if (scene.children.length >= 3) {
            scene.children[1].intensity = params.light.aIntensity // ambient light high intensity
            scene.children[2].intensity = 0 // no flash light
        }
    }, 100);
    
    controls.dampingFactor = 1
    controls.rotateSpeed = 1
    
    const defaultPixelRatio = renderer.getPixelRatio()
    const adjustedPixelRatio = Math.min(2, defaultPixelRatio)
    renderer.setPixelRatio(adjustedPixelRatio)
    
    // Globe coordinates
    // TODO
}

function awaitData() {
    d3.queue()
    .defer(d3.csv, 'data2/points5889_NADAC.csv')
    .defer(d3.csv, 'data2/labels5889_NADAC.csv')
    .defer(d3.csv, 'data2/paths5889_NADAC.csv')
    //.defer(d3.csv, 'data2/path_basic_colors5889.csv')
    .defer(d3.csv, 'data2/path_colors5889_NADAC.csv')
    //.defer(d3.csv, 'data2/color_timeline5889.csv')
    .defer(d3.csv, 'data2/places_venues_repertory_5889_NADAC.csv')
    .defer(d3.json, 'data2/nested_places_venues_repertory_5889_NADAC.json')
    .defer(d3.csv, 'data2/state-abbrev.csv')
    .await(ready)
}

function ready(error, pointsData, labelsData, pathsData, pathColorsData, venuesData, nestedVenuesData, abbrevData) {
//function ready(error, pointsData, labelsData, pathsData, pathColorsData, timelineColorData, venuesData, nestedVenuesData, abbrevData) {
//function ready(error, pointsData, pathsData, pathColorsData) {
    // Code 2
    readData()
    loadData()
    drawInit()
    setTimeout(() => {
      drawTransitionToDefault3()
      setTimeout(() => {
        prepareHighlightableData()
      }, 2000)
    }, 3000)
    
    

    //drawTransitionToDefault()
    //drawTransitionToDefault2()
    
    //prepareTouringData()
    //stop()
    
    // Functions 2
    function readData() {
        var points = []
        var pointLabelsDictList = {}
        var pointAndLabelIdDict = {}
        var pointTickDates = {}
        var labels = []
        var paths = []
        //var paths2 = []
        var pathLabels = []
        var pathCities = []
        var pathDates = []
        var pathActions = []
        var dots = []
        
        var alts = unpack(pointsData, 'Altitude')
        var totalDays = Math.max.apply(null, alts)
        
        const venues = Object.fromEntries(
          venuesData.map(({ Place, ...rest }) => [Place, rest])
        )
        
        for (var i=0; i<pointsData.length; i++) {
            var pointData = pointsData[i]
            var point = {
                lat: pointData['Latitude'] * 1, // parseInt
                lng: pointData['Longitude'] * 1,
                altitude: pointData['Altitude'] / (totalDays * 10/4),
                city: pointData['City'],
                id: i,
                type: 'thinPole', // thinPole or thickPole
                name: null, // label (to be filled below)
            }
            var point2 = {
                lat: pointData['Latitude'] * 1,
                lng: pointData['Longitude'] * 1,
                altitude: pointData['Altitude'] / (totalDays * 10/4),
                city: pointData['City'],
                id: i,
                type: 'thickPole', // thinPole or thickPole
                name: null, // label (to be filled below)
            }
//            for (var i2=pointData['Altitude']; i2>=0; i2-=200) {
//              var point2 = {
//                  lat: pointData['Latitude'] * 1,
//                  lng: pointData['Longitude'] * 1,
//                  altitude: i2 / (totalDays * 10/4),
//                  city: pointData['City'],
//                  id: i+'-'+i2,
//                  type: 'thickPole', // thinPole or thickPole
//                  name: null, // label (to be filled below)
//                  color: timelineColorData[i2]['color']
//              }
//              points.push(point2)
//            }
            points.push(point)
            points.push(point2)
            pointLabelsDictList[pointData['City']] = []
            pointAndLabelIdDict[pointData['City']] = i
            pointTickDates[pointData['City']] = []
            
            var dot = {
                lat: pointData['Latitude'] * 1,
                lng: pointData['Longitude'] * 1,
                alt: 0 / (totalDays * 10/4),
                type: 'tick', // sphere or tick
                name: null, // label
            }
            dots.push(dot) // comment this line for no ticks
        }
        
//        for (var i=0; i<labelsData.length; i++) {
//            var labelData = labelsData[i]
//            if (labelData['Type'] == 'city') {
//                var label = {
//                    lat: labelData['Latitude'] - (labelData['Type'] == 'city' ? 0.2 : 0),
//                    lng: labelData['Longitude'] - (labelData['Type'] == 'city' ? 0 : -0.3),
//                    altitude: labelData['Altitude'] / (totalDays * 10/4),
//                    type: labelData['Type'], // city or year
//                    text: labelData['Text'], // label
//                    id: pointAndLabelIdDict[labelData['Text']]
//                }
//                var label2 = {
//                    lat: labelData['Latitude'] - (labelData['Type'] == 'city' ? 0.2 : 0),
//                    lng: labelData['Longitude'] - (labelData['Type'] == 'city' ? 0 : -0.3),
//                    altitude: labelData['Altitude'] / (totalDays * 10/4),
//                    type: 'citybckg', // city or year
//                    text: '_', // label
//                    text2: labelData['Text'], // label
//                    id: pointAndLabelIdDict[labelData['Text']]
//                }
//                labels.push(label)
//                labels.push(label2)
//            }
            //if (labelData['Type'] == 'year') {
            //    var dot = {
            //        lat: labelData['Latitude'],
            //        lng: labelData['Longitude'],
            //        alt: labelData['Altitude'] / (totalDays * 10/4),
            //        type: 'tick', // sphere or tick
            //        name: null, // label
            //    }
            //    dots.push(dot)
            //}
//        }
        
        
        var LABEL_LNG_SHIFT = 0.3
        var pathData = pathsData[0]
        var p1 = [
            pathData['Latitude'] / 1,
            pathData['Longitude'] / 1,
            pathData['Altitude'] / (totalDays * 10/4),
        ] // pathsData
        var city1 = pathData['City']
        var date1 = pathData['Date']
        var action = 'arrival'
        
        var dotColorAttr = 'Hexcode1'
        var dotColorIndex = 0
        var dotColor = pathColorsData[dotColorIndex][dotColorAttr]
        var dotColor2 = pathColorsData[dotColorIndex]['Hexcode2']
        var dotColor3 = pathColorsData[dotColorIndex]['Hexcode3']
        var dotColor4 = pathColorsData[dotColorIndex]['Hexcode4']
        var dotColor5 = pathColorsData[dotColorIndex]['Hexcode5']
        var dotColor6 = pathColorsData[dotColorIndex]['Hexcode6']
        var dotColor7 = pathColorsData[dotColorIndex]['Hexcode7']
        var dotColor8 = pathColorsData[dotColorIndex]['Hexcode8']
        
        var dot = {
            lat: pathData['Latitude'],
            lng: pathData['Longitude'],
            alt: pathData['Altitude'] / (totalDays * 10/4),
            type: 'sphere', // sphere or tick
            name: `<div class="dot tooltip"><span class="label">&#9202; ${action=='arrival'?'Arrived to':'Left from'} ${pathData['City']} on ${pathData['Date']}</span></div>`,
//            name: null,
            city: pathData['City'],
            date: pathData['Date'],
            action: action,
            color: dotColor,
            color2: dotColor2,
            color3: dotColor3,
            color4: dotColor4,
            color5: dotColor5,
            color6: dotColor6,
            color7: dotColor7,
            color8: dotColor8,
        }
        dots.push(dot)
        
//        var label
//        var year = pathData['Date'].split(', ')[1]
//        if (!pointTickDates[city1].includes(year)) {
//            label = {
//                lat: pathData['Latitude'] / 1,
//                lng: pathData['Longitude'] / 1 + LABEL_LNG_SHIFT,
//                altitude: pathData['Altitude'] / (totalDays * 10/4),
//                type: 'year', // city or year
//                text: year,
//                id: null,
//            }
//            labels.push(label)
//            pointTickDates[city1].push(year)
//        }
        
        var p2, city2
        for (var i=1; i<pathsData.length; i++) {
            pathData = pathsData[i]
            p2 = [
                pathData['Latitude'] / 1,
                pathData['Longitude'] / 1,
                pathData['Altitude'] / (totalDays * 10/4),
            ] // pathsData
            city2 = pathData['City']
            date2 = pathData['Date']
            paths.push([p1, p2]) // pathsData
//            var pLabel
            //action = city1 == city2 ? 'departure' : 'arrival'
            action = i%2!=0 ? 'departure' : 'arrival'
            if (action == 'departure') {
                if (city1 != city2) ERROR
                pointLabelsDictList[city2].push([date1, date2])
//                pLabel = `<div class="path tooltip"><i class="fa fa-compass"></i><span class="label"> In ${city1} from ${date1} to ${date2}</span></div>`
            }
//            else
//                pLabel = `<div class="path tooltip"><i class="fa fa-compass"></i><span class="label"> From ${city1} to ${city2} on ${pathData['Date']}</span></div>`
//            pathLabels.push(pLabel)
            pathCities.push({'src': city1, 'dst': city2}) // filtering paths by source, destination, and date
            pathDates.push(pathData['Date'])              // filtering paths by source, destination, and date
//            pathActions.push(action)
            p1 = p2 // pathsData
            city1 = city2
            date1 = date2
            var dotColorAttr = 'Hexcode1'
            var dotColorIndex = i < pathColorsData.length ? i : pathColorsData.length - 1
            var dotColor = pathColorsData[dotColorIndex][dotColorAttr]
            var dotColor2 = pathColorsData[dotColorIndex]['Hexcode2']
            var dotColor3 = pathColorsData[dotColorIndex]['Hexcode3']
            var dotColor4 = pathColorsData[dotColorIndex]['Hexcode4']
            var dotColor5 = pathColorsData[dotColorIndex]['Hexcode5']
            var dotColor6 = pathColorsData[dotColorIndex]['Hexcode6']
            var dotColor7 = pathColorsData[dotColorIndex]['Hexcode7']
            var dotColor8 = pathColorsData[dotColorIndex]['Hexcode8']
            dot = {
                lat: pathData['Latitude'],
                lng: pathData['Longitude'],
                alt: pathData['Altitude'] / (totalDays * 10/4),
                type: 'sphere', // sphere or tick
                name: `<div class="dot tooltip"><span class="label">&#9202; ${action=='arrival'?'Arrived to':'Left from'} ${pathData['City']} on ${pathData['Date']}</span></div>`,
                //name: null,
                city: pathData['City'],
                date: pathData['Date'],
                action: action,
                color: dotColor,
                color2: dotColor2,
                color3: dotColor3,
                color4: dotColor4,
                color5: dotColor5,
                color6: dotColor6,
                color7: dotColor7,
                color8: dotColor8,
            }
            if (action == 'arrival') // only one sphere (arrival) per stay instead of two (arrival and departure)
              dots.push(dot)
            
//            year = pathData['Date'].split(', ')[1]
//            if (!pointTickDates[city1].includes(year)) {
//                label = {
//                    lat: pathData['Latitude'] / 1,
//                    lng: pathData['Longitude'] / 1 + LABEL_LNG_SHIFT,
//                    altitude: pathData['Altitude'] / (totalDays * 10/4),
//                    type: 'year', // city or year
//                    text: year,
//                    id: null,
//                }
//                labels.push(label)
//                pointTickDates[city1].push(year)
//            }
            
        }
        
        for (var i=0; i<points.length; i++) {
            var point = points[i]
            var city = point.city
            var stays = pointLabelsDictList[city]
            var label = `<div class="point tooltip"><span class="label header">${city}</span><br><span data-name="tooltip-dates" class="tooltip-opt selected">Dates</span> · <span data-name="tooltip-venues" class="tooltip-opt">Venues</span> · <span data-name="tooltip-repertory" class="tooltip-opt">Repertory</span> · <span data-name="tooltip-beta" class="tooltip-opt">Beta</span><br>`
            label += `<div id="tooltip-dates" class="parent selected">`
            for (var j=stays.length-1; j>=0; j--) {
                var stay = stays[j]
                var date1 = stay[0]
                var date2 = stay[1]
                const condensedDate = condenseDates(date1, date2)
//                if (date1 == date2)
//                    label += `<span class="label row" id=${date1.replace(/ /g, '').replace(',', '-')}>· On ${date1}</span><br>`
//                else
//                    label += `<span class="label row" id=${date1.replace(/ /g, '').replace(',', '-')}>· From ${date1} to ${date2}</span><br>`
                label += `<span class="label row" id=${date1.replace(/ /g, '').replace(',', '-')}>${condensedDate}</span>`
            }
            label += `</div><div id="tooltip-venues" class="parent">`
//            point.name = label
//            labels[pointAndLabelIdDict[point.city]*2].name = label
//            labels[pointAndLabelIdDict[point.city]*2+1].name = label
            
            const venuesRepInfo = venues[city]
            const venuesList = venuesRepInfo['Venues'].split('; ').filter(x => x.length)
            for (var i1=0; i1<venuesList.length; i1++)
              label += `<span class="label row">${venuesList[i1]}</span>`
            label += `</div><div id="tooltip-repertory" class="parent">`
            const repList = venuesRepInfo['Repertory'].split('; ').filter(x => x.length)
            for (var i2=0; i2<repList.length; i2++)
              label += `<span class="label row">${repList[i2]}</span>`
            label += `</div><div id="tooltip-beta" class="parent">`
            
            //const cityInfoBeta = nestedVenuesData[city] // old
            const cityInfoBeta = object2array(nestedVenuesData[city]).reverse() // new
            //for (var k in cityInfoBeta) { // old
            cityInfoBeta.forEach((arr) => { // new
              //var dateBeta = k // old
              //var infoBeta = cityInfoBeta[k] // old
              var dateBeta = arr[0] // new
              var infoBeta = arr[1] // new
              label += `<div>` // new
              label += `<span class="label row date-beta">${dateBeta}</span>`
              var venuesListBeta = infoBeta['Venues'].split('; ').filter(x => x.length)
              for (var i3=0; i3<venuesListBeta.length; i3++)
                label += `<span class="label row venues-beta">  ${venuesListBeta[i3]}</span>`
              var repListBeta = infoBeta['Repertory'].split('; ').filter(x => x.length)
              for (var i4=0; i4<repListBeta.length; i4++)
                label += `<span class="label row repertory-beta">  ${repListBeta[i4]}</span>`
            //} // old
              label += `</div>` // new
            }) // new
            label += `</div></div>`
            point.name = label
        }
        
        // pathsData
        var colorAttr = 'Hexcode1'
        for (var i=0; i<paths.length; i++) {
            paths[i].id = i
            paths[i].name   = pathColorsData[i][colorAttr] == 'grey' ? pathLabels[i].replace(' on ', ' around ') : pathLabels[i]
            paths[i].color  = pathColorsData[i][colorAttr]
            paths[i].color1 = pathColorsData[i].Hexcode1
            paths[i].color2 = pathColorsData[i].Hexcode2
            paths[i].color3 = pathColorsData[i].Hexcode3
            paths[i].color4 = pathColorsData[i].Hexcode4
            paths[i].color5 = pathColorsData[i].Hexcode5
            paths[i].color6 = pathColorsData[i].Hexcode6
            paths[i].color7 = pathColorsData[i].Hexcode7
            paths[i].color8 = pathColorsData[i].Hexcode8
              // pathsData
            paths[i].src = pathCities[i].src // filtering paths by source, destination, and date
            paths[i].dst = pathCities[i].dst // filtering paths by source, destination, and date
            paths[i].date = pathDates[i]     // filtering paths by source, destination, and date
//            paths[i].action = pathActions[i]
        }
        
        pointsD = points
        //labelsD = labels
        pathsD = paths // pathsData
        //paths2D = paths2
        dotsD = dots
        
        myPathsData = paths
    }
    
    function loadData() {
      globe
      .pointsData(pointsD)
      //.labelsData(labelsD)
      .pathsData(pathsD) // pathsData - no lines by default - shift + L to show/hide
      //.paths2Data(paths2D)
      .customLayerData(dotsD)
    }
    
    function drawInit() {
      var ALT0 = 0.01
      globe
      .pointColor(d => d.type == 'thinPole' ? params.point.color : params.point2.color)
      .pointRadius(d => d.type == 'thinPole' ? params.point.radius : params.point2.radius)
      .pointAltitude(0)
      
      .pathColor(params.path.color)
      //.pathStroke(() => params.path.stroke)
      .pathStroke(0)
      .pathPointAlt(ALT0)
      
      .customThreeObject(d => {
        //var color = d.type == 'sphere' ? params.dot.sphereColor : params.dot.tickColor
        var color = d.type == 'sphere' ? d.color : params.dot.tickColor
        var radius = d.type == 'sphere' ? params.dot.sphereRadius : params.dot.tickRadius
        return new THREE.Mesh(
          new THREE.SphereBufferGeometry(radius, 20, 20),
          new THREE.MeshLambertMaterial({ color: color })
        )
      })
      .customThreeObjectUpdate((obj, d) => {
        Object.assign(obj.position, globe.getCoords(d.lat, d.lng, 0)) // d.alt -> 0
      })
      
      var duration = 1000
      globe
      .pointsTransitionDuration(duration)
      //.labelsTransitionDuration(duration)
      .pathTransitionDuration(duration * 1.2) // pathsData
      //.path2TransitionDuration(duration)
      
      STATUS = 0
      COLOR = true
    }
    
    function drawDefault() {
      globe
      .pointAltitude('altitude')
      //.labelAltitude('altitude')
      //.pathPointAlt(d => d[2])
      //.path2PointAlt(d => d[2])
      .customThreeObject(d => {
      })
      .customThreeObjectUpdate((obj, d) => {
        Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt)) // d.alt -> 0
      })
      
      STATUS = 1
    }
    
    function drawTransitionToDefault() {
      //setTimeout(() => {
        drawDefault()
      //}, 5000);
    }
    
    function drawDefault2() {
      globe
      //.pathStroke(0)
      for (var i=0; i<10; i++) {
          setTimeout(() => {
            globe
            .customThreeObject(d => {
            })
            .customThreeObjectUpdate((obj, d) => {
              obj.scale.setScalar(i+1)
            })
          }, i * 100)
          
      }
      
      STATUS = 2
    }
    
    function drawTransitionToDefault2() {
      //setTimeout(() => {
        drawDefault2()
      //}, 10000);
      setTimeout(() => {
        globe.pathsData([])
      }, 5000);
    }
    
    var timestart
    function foo(timestamp) {
      if (!timestart)
        timestart = timestamp
      const progress = (timestamp - timestart) / 1000
      
      if (progress <= 1) {
        globe
        //.pathPointAlt(d => d[2] * progress) // pathsData
        .customThreeObject(d => {
        })
        .customThreeObjectUpdate((obj, d) => {
          Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt * progress))
          obj.scale.setScalar(11)
        })
        requestAnimationFrame(foo)
      }
      else {
        globe
        //.pathPointAlt(d => d[2]) // pathsData
        .customThreeObject(d => {
        })
        .customThreeObjectUpdate((obj, d) => {
          Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt * 1))
          obj.scale.setScalar(11)
        })
        // Camera distance
        controls.minDistance = 330 // min altitude ~2.3
        controls.maxDistance = 2000 // max altitude ~20
      }
    }
    
    function drawDefault3() {
      requestAnimationFrame(foo)
    }
    
    function drawTransitionToDefault3() {
      $('.scene-tooltip').insertAfter('#globe-container');
      globe
      .pathPointAlt(d => d[2]) // pathsData
      .pointAltitude('altitude')
      drawDefault3()
    }
    
//    setTimeout(() => {
//      drawTransitionToDefault3()
//    }, 5000)
    
    function prepareHighlightableData() {
        var poles = globe.pointsData()
        poles.forEach(d => cityPole[d.city] = d)
        var dots = globe.customLayerData()
        dots.forEach(d => {
          if (d.type == 'sphere') {
            if (!(d.city in citySpheres))
              citySpheres[d.city] = []
            citySpheres[d.city].push(d)
          }
        })
        //globe.customThreeObject(d => {}).customThreeObjectUpdate((obj, d) => { console.log(obj.id, d.city) })
    }
    
    function colorPathsAndDotsAux(attr) {
        globe.pathTransitionDuration(0)
        if (STATUS < 2)
            globe.pathColor(attr)
        globe
        .customThreeObject(d => {
        })
        .customThreeObjectUpdate((obj, d) => {
          if (d.type == 'sphere') {
            obj.material.color = hex2rgbNorm(d[attr])
          }
        })
    }
    
    function colorPathsAndDots(attr) {
        colorPathsAndDotsAux(attr)
    }
    
    document.body.onkeydown = function(ev) {
        // https://keycode.info/
        if (false) {}
//        else if (ev.keyCode == 78 && !ev.ctrlKey && STATUS == 0) { // N
//            ev.preventDefault()
//            drawTransitionToDefault()
//        }
//        else if (ev.keyCode == 78 && !ev.ctrlKey && STATUS == 1) { // N
//            ev.preventDefault()
//            drawTransitionToDefault2()
//        }
//        else if (ev.keyCode == 78 && !ev.ctrlKey) { // N
//            ev.preventDefault()
//            drawTransitionToDefault3()
//        }
        else if (ev.keyCode == 49 && !ev.ctrlKey) { // 1
            ev.preventDefault()
            colorPathsAndDots('color')
        }
        else if (ev.keyCode == 50 && !ev.ctrlKey) { // 2
            ev.preventDefault()
            colorPathsAndDots('color2')
        }
        else if (ev.keyCode == 51 && !ev.ctrlKey) { // 3
            ev.preventDefault()
            colorPathsAndDots('color3')
        }
<!--            else if (ev.keyCode == 52 && !ev.ctrlKey) { // 4-->
<!--                ev.preventDefault()-->
<!--                colorPathsAndDots('color4')-->
<!--            }-->
<!--            else if (ev.keyCode == 53 && !ev.ctrlKey) { // 5-->
<!--                ev.preventDefault()-->
<!--                colorPathsAndDots('color5')-->
<!--            }-->
<!--            else if (ev.keyCode == 54 && !ev.ctrlKey) { // 6-->
<!--                ev.preventDefault()-->
<!--                colorPathsAndDots('color6')-->
<!--            }-->
<!--            else if (ev.keyCode == 55 && !ev.ctrlKey) { // 7-->
<!--                ev.preventDefault()-->
<!--                colorPathsAndDots('color7')-->
<!--            }-->
<!--            else if (ev.keyCode == 56 && !ev.ctrlKey) { // 8-->
<!--                ev.preventDefault()-->
<!--                colorPathsAndDots('color8')-->
<!--            }-->
//        else if (ev.keyCode == 66 && !ev.ctrlKey) { // B
//            ev.preventDefault()
//            var selection1 = 'backgroundColor' + STATUS_BACKGROUNDCOLOR
//            var selection2 = params.globe[selection1]
//            scene.background = new THREE.Color(selection2)
//            //document.body.style.backgroundColor = selection2
//            STATUS_BACKGROUNDCOLOR = (STATUS_BACKGROUNDCOLOR + 1) % 2
//            
//            if (scene.children.length >= 2) {
//                var myLight = scene.children[1]
//                myLight.intensity = params.light.aIntensity
//            }
//        }
        else if (ev.code == 'KeyL' && ev.shiftKey) { // L
            //ev.preventDefault()
            globe.pathsData(globe.pathsData().length ? [] : myPathsData)
        }
        //console.log(ev, String.fromCharCode(ev.keyCode)+" --> "+ev.keyCode);
    };
    
    
    window.addEventListener("scroll", function(ev){
        //console.log('Scroll is happening...')
    });
    
    window.addEventListener("resize", function(ev){
        //console.log('Resize is happening...')
    });
    
    
    // SEARCH
    
    const stateAbbrev = Object.fromEntries(
      abbrevData.map(({ State, Abbreviation }) => [ Abbreviation, State ])
    )
    
    function buildSearchBar() {
      var searchBar = document.getElementById('searchBar')
      $('#searchBar').show()
      
      var elems = unpack(pointsData, 'City')
      elems.sort()
      
      var ul = document.getElementById('searchUL')
      ul.classList.add('ulPerformers')
      elems.forEach(function (x) {
        let li = document.createElement('li')
        //li.id = x[0]
        li.id = x
        li.classList.add('liPerformer')
        li.style.display = 'none'
        ul.appendChild(li)
        //li.innerHTML = '<a href="#" id="'+formatId(x)+'">'+x+'</a>'
        //li.innerHTML = x[1]
        li.innerHTML = x
        var alt = x
        if (alt.endsWith('USA')) {
          for (var k in stateAbbrev)
            alt = alt.replace(`, ${k}, USA`, `, ${stateAbbrev[k]}, USA`)
        }
        li.setAttribute('data-alt', alt)
        li.addEventListener('mouseover', function(ev) {
          ev.preventDefault()
          const city = ev.target.id
          const d = cityPole[city]
          hoverOnPole(d)
        })
        li.addEventListener('mouseout', function(ev) {
          ev.preventDefault()
          const city = ev.target.id
          const d = cityPole[city]
          unhoverOnPole(d)
        })
        li.addEventListener('mousedown', function(ev) {
          ev.preventDefault()
          
          const city = ev.target.id
          const pole = cityPole[city]
          
          ctrlKey = ev.ctrlKey
          if (ctrlKey)
            clickOnPole(pole)
          else {
            const lat = pole.lat
            const lng = pole.lng
            const loc = {lat: lat - 20, lng: lng, altitude: 3}
            //goTo(loc, 2/3, searchTravelTime, 'search')
            goTo(loc, 50, searchTravelTime, 'search')
            setTimeout(() => {
              clickOnPole(pole, true)
            }, 1000)
          }
        })
      })
      document.getElementById('searchInput').value = ''
      document.getElementById('searchCloseButton').addEventListener('click', function(ev) {
        closeSearch(ev)
      })
      searchBar.addEventListener('keyup', searchPerformer)
      document.getElementById('searchInput').addEventListener('focusin', (ev) => {
    //      $('#searchCloseButton').css('opacity', 0.9)
        $('#searchCloseButton').addClass('active')
        $('#searchInput').addClass('active')
      })
      document.getElementById('searchInput').addEventListener('mouseover', (ev) => {
        //clearTimeout(unhighlightTimeout)
        // it necessary both solutions in combination to stop the unhighlight
      })
      document.getElementById('searchInputAndCloseButton').addEventListener('mouseleave', (ev) => {
        if ($('#searchUL li.liPerformer:visible').length == 0) {
          closeSearch2()
        }
      })
      $('div.searchResults').on('mouseleave', (ev) => {
      })
      $('div.searchResults').on('mouseover', (ev) => {
      })
    }
    buildSearchBar()
    
    function closeSearch(ev) {
      ev.preventDefault()
      return closeSearch2()
    }
    
    function closeSearch2() {
      document.getElementById('searchInput').value = ''
  //    $('#searchCloseButton').css('opacity', 0)
      $('#searchCloseButton').removeClass('active')
      $('#searchInput').removeClass('active')
      $('#searchUL li.liPerformer').hide()
      $('div.searchResults').hide()
      
      $('#searchInput').blur()
      
      SELECTIONON = false
      $('li.liPerformer').removeClass('selected')
      
      return false
    }
    
    function searchPerformer(ev) {
      $('div.searchResults').removeClass('svg')
      
      ev.preventDefault()
      // Declare variables
      var input, filter, ul, li, a, i, txtValue;
      input = document.getElementById('searchInput');
      filter = input.value.toUpperCase();
      
      if (filter.length > 0) {
        $('div.searchResults').show()
        ul = document.getElementById('searchUL');
        li = ul.getElementsByTagName('li');
        
        var counter = 0
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
          a = li[i]//.getElementsByTagName("a")[0];
          txtValue = a.textContent || a.innerText;
          txtValue2 = a.getAttribute('data-alt')
          if (txtValue.toUpperCase().indexOf(filter) == 0 || txtValue.toUpperCase().indexOf(', '+filter) > -1 || txtValue2.toUpperCase().indexOf(filter) == 0 || txtValue2.toUpperCase().indexOf(', '+filter) > -1) {
            li[i].style.display = "";
            counter ++;
          } else {
            li[i].style.display = "none";
          }
        }
        if (counter) {
          $('#noResults').hide()
        }
        else {
          $('#noResults').show()
        }
      }
      else {
        //$('#searchCloseButton').hide()
        $('#searchUL li.liPerformer').hide()
        $('div.searchResults').hide()
      }
    }
}



// Utils
function euclideanDistance(a) {
  p1 = a[0]
  p2 = a[1]
  xdiff = Math.pow((p1[0] - p2[0]), 2)
  ydiff = Math.pow((p1[1] - p2[1]), 2)
  zdiff = Math.pow((p1[2] - p2[2]), 2)
  return Math.sqrt( xdiff + ydiff + zdiff)
}

function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

function randomLoc() {
    var absX = Math.random() * 100
    var sigX = Math.random() >= 0.5 ? 1 : -1
    var x = sigX * absX
    var absY = Math.random() * 100
    var sigY = Math.random() >= 0.5 ? 1 : -1
    var y = sigY * absY
    var z = Math.random() * 4 + 2
    var goto = {
        lat: x,
        lng: y,
        altitude: z,
    }
    return goto
}

function hexa2hexAndAlpha(hexa) {
    if (hexa.length == 7)
        hexa = hexa + 'FF'
    var hex = hexa.slice(0, hexa.length-2)
    var alpha = +('0x' + hexa.slice(-2)) / 255
    return [hex, alpha]
}
function hex2rgbNorm(h) {
  var r, g, b
  r = +("0x" + h[1] + h[2]) / 255
  g = +("0x" + h[3] + h[4]) / 255
  b = +("0x" + h[5] + h[6]) / 255
  return {r: r, g: g, b: b}
}

function removeElement(a, e) {
    var i = a.indexOf(e)
    a.splice(i, 1)
}

function straightlineEquation(x1, y1, x2, y2, x) {
    y = ((y2 - y1) / (x2 - x1)) * (x - x1) + y1
    return y
}

function condenseDates(str1, str2) {
  var r;
  if (str1 == str2)
    r = str1
  else {
    const date1 = new Date(str1)
    const d1 = date1.getDate()
    const m1 = str1.slice(0, 3)
    const y1 = date1.getFullYear()
    const date2 = new Date(str2)
    const d2 = date2.getDate()
    const m2 = str2.slice(0, 3)
    const y2 = date2.getFullYear()
    if (y1 == y2) {
      if (m1 == m2) {
        r = m1 + ' ' + d1 + '-' + d2 + ', ' + y1
        if (d1 == d2)
          FAIL
      }
      else
        r = m1 + ' ' + d1 + ' - ' + m2 + ' ' + d2 + ', ' + y1
    }
    else
      r = str1 + ' - ' + str2
  }
  r = r.replace('Jan', 'Jan.').replace('Feb', 'Feb.').replace('Mar', 'Mar.').replace('Apr', 'Apr.').replace('Jun', 'Jun.').replace('Jul', 'Jul.').replace('Aug', 'Aug.').replace('Sep', 'Sep.').replace('Oct', 'Oct.').replace('Nov', 'Nov.').replace('Dec', 'Dec.')
  return r
}

function equalDates(d1, d2) {
  return d1.getTime() === d2.getTime();
}

const object2array = obj => Object.keys(obj).map((key) => [key, obj[key]])

////////////////
//            //
// DRAG GLOBE //
//            //
////////////////

const veryOriginalX = -(WIDTH - INIT_WIDTH) / 2
const veryOriginalY = -(HEIGHT - INIT_HEIGHT) / 2
var allowDrag, lastX, lastY, originalX = veryOriginalX, originalY = veryOriginalY
var draggingHappened = false
var fix_tooltip = false
globeDiv.addEventListener('mousedown', ev => {
  ev.preventDefault()
  if (ev.button == 2) { // right click
    allowDrag = true
    lastX = ev.clientX - originalX
    lastY = ev.clientY - originalY
  }
  
  // Tooltips
//  $('#my-tooltip').html('')
//  fix_tooltip = false
//  if (currentHighlightedPole) {
//    unhighlightPole(currentHighlightedPole)
//    unhighlightSpheres(currentHighlightedPole)
//    //currentHighlightedPole = null
//  }
})
globeDiv.addEventListener('mousemove', ev => {
  ev.preventDefault()
  if (allowDrag) {
    const diffX = ev.clientX - lastX
    const diffY = ev.clientY - lastY
//    $(globeDiv).css('transform', `translate(${diffX}px, ${diffY}px)`)
    $(globeDiv).css('translate', `${diffX}px ${diffY}px`)
    draggingHappened = true
  }
})
globeDiv.addEventListener('mouseup', ev => {
  ev.preventDefault()
  if (ev.button == 2 && allowDrag) { // right click and allow drag
    allowDrag = false
    originalX = ev.clientX - lastX
    originalY = ev.clientY - lastY
  }
})
globeDiv.addEventListener('mouseout', ev => {
  ev.preventDefault()
  if (allowDrag) { // allow drag
    allowDrag = false
    originalX = ev.clientX - lastX
    originalY = ev.clientY - lastY
  }
})
globeDiv.addEventListener('mouseover', ev => {
  ev.preventDefault()
  if (ev.buttons == 2) { // right button pressed
    allowDrag = true
    lastX = ev.clientX - originalX
    lastY = ev.clientY - originalY
  }
})


// Other globe events
var leftClick = false
var ctrlKey = false

globeDiv.addEventListener('dblclick', function(ev) {
//  var currentAlt = globe.pointOfView().altitude
//  if (currentAlt < 3)
//      globe.pointOfView({altitude: 5}, jumpTransition)
//  else
//      globe.pointOfView({altitude: 1}, jumpTransition)
//  // if (globe.pointOfView().altitude < 9) TRUE
//  $('#description').removeClass('visible')
})

globeDiv.addEventListener('mousedown', function(ev) {
  if (ev.button == 0) {
    leftClick = true
  }
  if (ev.ctrlKey) {
    ctrlKey = true
  }
})

globeDiv.addEventListener('mouseup', function(ev) {
  if (ev.button == 2 && !draggingHappened) {
    if (!playTour) {
      clearSelection()
      hideTooltip()
      clearTour()
    }
  }
  draggingHappened = false
  leftClick = false
  ctrlKey = false
})

function globeInMotion() {
  return playTour || $('#globeViz').hasClass('transition-translate-search') || endingTour
}

// Highlighting functions
var cityPole = {}
var citySpheres = {}
var currentHighlightedPole = null
var selectedPoles = []
var tourPaths = new Set()

function highlightPoleAndSpheres(pole) {
  highlightPole(pole)
  highlightSpheres(pole)
  boldSearchResult(pole)
}

function unhighlightPoleAndSpheres(pole) {
  unhighlightPole(pole)
  unhighlightSpheres(pole)
  normalSearchResult(pole)
}

function setPathWidth(path, w) {
  path.__threeObj.material.linewidth = w
}

function showPath(path, width=0.6) {
  setPathWidth(path, width)
}

function hidePath(path) {
  setPathWidth(path, 0)
}

function addToPaths(path) {
  tourPaths.add(path)
}

function clearPaths() {
  tourPaths.forEach(d => hidePath(d))
  tourPaths.clear()
}

function clearTour() {
  clearSelection()
  clearPaths()
}

function endTour() {
  clearTour()
  clearTimeout(nextTimer)
  clearTimeout(highlightTimer)
  resetGlobe({altitude: 10}, tourTravelTime* 0.5, 'transition-translate-2')
  
  $('#interface-content').removeClass('left')
  $('#description').removeClass('left')
  $('#globeViz').removeClass('left')
  $('#side-panel-2').removeClass('visible')
  $('#my-tooltip-2').removeClass('visible')
  
  endingTour = true
  setTimeout(() => { endingTour = false }, tourTravelTime * 0.5)
}

function boldSearchResult(d) {
  const city = d.city
  if (city) {
    const li = document.getElementById(city)
    li.classList.remove('noevents')
    li.classList.add('fake-hover')
  }
}

function normalSearchResult(d) {
  const city = d.city
  if (city) {
    const li = document.getElementById(city)
    li.classList.remove('fake-hover')
    li.classList.add('noevents')
  }
}

function clickOnPole(d, force=false) { // force comes search
  
//  if (false) {}
//  else if (!isSelected(d) && !ctrlKey) {
//    clearSelection()
//    highlightPoleAndSpheres(d)
//    addToSelection(d)
//  }
//  else if (!isSelected(d) && ctrlKey) {
//    highlightPoleAndSpheres(d)
//    addToSelection(d)
//  }
//  else if (isSelected(d) && !ctrlKey) {
//    if (isOnlySelected(d)) {
//      unhighlightPoleAndSpheres(d)
//      removeFromSelection(d)
//    }
//    else {
//      clearSelection()
//      highlightPoleAndSpheres(d)
//      addToSelection(d)
//    }
//  }
//  else if (isSelected(d) && ctrlKey) {
//    unhighlightPoleAndSpheres(d)
//    removeFromSelection(d)
//  }
//  else { FAIL }
  
  if (!isSelected(d) || (!ctrlKey && !isOnlySelected(d)) || force) {
    if (!ctrlKey)
      clearSelection()
    addToSelection(d)
    hoverOnPole(d)
    $('#reverse-icon').addClass('visible')
  }
  else if (ctrlKey || isOnlySelected(d)) {
    removeFromSelection(d)
    unhoverOnPole(d, true)
    $('#reverse-icon').removeClass('visible')
  }
}

function clickOnSphere(d) {
  const pole = cityPole[d.city]
  if (pole)
    clickOnPole(pole)
}

function hoverOnPole(d) {
  highlightPoleAndSpheres(d)
  showTooltip(d)
}

function unhoverOnPole(d, force=false) { // force comes from "unclick"
  if (!isSelected(d) || force)
    unhighlightPoleAndSpheres(d)
  hideTooltip()
}

function hoverOnSphere(d) {
  const pole = cityPole[d.city]
  if (pole)
    hoverOnPole(pole)
}

function unhoverOnSphere(d) {
  const pole = cityPole[d.city]
  if (pole)
    unhoverOnPole(pole)
}

function addToSelection(pole) {
  selectedPoles.push(pole)
}

function removeFromSelection(pole) {
  const i = selectedPoles.indexOf(pole)
  selectedPoles.splice(i, 1)
}

function isSelected(pole) {
  return selectedPoles.includes(pole)
}

function isOnlySelected(pole) {
  return selectedPoles.length == 1 && selectedPoles[0] == pole
}

function lastSelectedPole() {
  return selectedPoles.length > 0 ? selectedPoles[selectedPoles.length-1] : null
}

function clearSelection() {
  selectedPoles.forEach(d => unhighlightPoleAndSpheres(d))
  selectedPoles = []
}

function showTooltip(pole) {
  $('#my-tooltip').html(pole.name)
  $('#my-tooltip').addClass('visible')
}

function hideTooltip() {
  const last = lastSelectedPole()
  if (last) {
    $('#my-tooltip').html(last.name)
    $('#my-tooltip').addClass('visible')
  }
  else {
    $('#my-tooltip').html('')
    $('#my-tooltip').removeClass('visible')
    $('#reverse-icon').removeClass('visible')
  }
}

function highlightPole(d) {
  d.__threeObj.scale.x = params.point2.radius * 2
  d.__threeObj.scale.y = params.point2.radius * 2
  //d.__threeObj.scale.z *= 2
  var poleColor = new THREE.MeshLambertMaterial({
    //color: d.color, //'white', //params.point2.highHexColor, white instead of aqua THIS FOR GRADIENT COLOR BUT IT DOESN'T WORK
    color: params.point2.highHexColor,
    transparent: params.point2.highOpacity < 1,
    opacity: params.point2.highOpacity,
  })
  d.__threeObj.material = poleColor
  d.highlighted = true
}

function unhighlightPole(d) {
  var poleColor = new THREE.MeshLambertMaterial({
    color: params.point2.hexColor,
    transparent: params.point2.opacity < 1,
    opacity: params.point2.opacity,
  })
  d.__threeObj.material = poleColor
  d.highlighted = false
  //d.__threeObj.scale.z /= 2
}

function highlightSpheres(d) {
  const spheres = citySpheres[d.city]
  if (spheres)
    spheres.forEach(d => highlightSphere(d))
}

function unhighlightSpheres(d) {
  const spheres = citySpheres[d.city]
  if (spheres)
    spheres.forEach(d => unhighlightSphere(d))
}

function highlightSphere(d) {
  d.__threeObj.scale.x = 22
  d.__threeObj.scale.y = 22
  d.__threeObj.scale.z = 22
  Object.assign(d.__threeObj.position, globe.getCoords(d.lat, d.lng, d.alt))
}

function unhighlightSphere(d) {
  d.__threeObj.scale.x = 11
  d.__threeObj.scale.y = 11
  d.__threeObj.scale.z = 11
  Object.assign(d.__threeObj.position, globe.getCoords(d.lat, d.lng, d.alt))
}



////////////////////////////////
//                            //
// MENU AND DEMO INTERACTIONS //
//                            //
////////////////////////////////

document.getElementById('menu-icon').addEventListener('mousedown', function(ev) {
  if (!globeInMotion()) {
    $('#interface-content').toggleClass('left')
    $('#description').toggleClass('left')
    $('#globeViz').toggleClass('left')
    $('#side-panel').toggleClass('visible')
  }
})

document.getElementById('reset-icon').addEventListener('mousedown', function(ev) {
  if (!globeInMotion())
    resetGlobe(initLoc, 1000, 'transition-translate-1')
})

document.getElementById('reverse-icon').addEventListener('mousedown', function(ev) {
  $('.parent').toggleClass('reversed')
})

$('#my-tooltip').on('mousedown', '.tooltip-opt', function(ev) {
  $('#my-tooltip .tooltip-opt').removeClass('selected')
  const thisJQ = $(this)
  thisJQ.addClass('selected')
  $('.parent').removeClass('selected')
  $(`#${thisJQ.data('name')}`).addClass('selected')
})


// Sample code for filtering paths by source, destination, and date
//temp0.filter(x =>
//  x.src.includes('Japan') && x.dst.includes('Japan') && ((new Date(x.date)) < (new Date('1970')))
//)

////////////////////////////////////////////////////////////////////////////////
// TOURS
////////////////////////////////////////////////////////////////////////////////

document.getElementById('play-pause-icon').addEventListener('mousedown', function(ev) {
  try {
    playTour = !playTour
    runTours(tours) // fails when the globe is loading; on top of this, disable play button on globe load
    
    if (playTour) { // THE FOLLOWING NUMBERS 1-4 CORRESPOND TO MY NOTES P.116
      clearSelection()
      hideTooltip()
      $('#menu-icon').addClass('inactive')
      $('#reset-icon').addClass('inactive')
      if ($('#side-panel').hasClass('visible')) {
        $('#side-panel').removeClass('visible')
        if (isSideTour) { // 1
          setTimeout(() => {
            $('#side-panel-2').addClass('visible')
          }, 1000)
        }
        else { // 3
          $('#interface-content').removeClass('left')
          $('#description').removeClass('left')
          $('#globeViz').removeClass('left')
          //$('#side-panel').removeClass('visible')
          
          $('#my-tooltip-2').addClass('visible')
        }
      }
      else {
        if (isSideTour) { // 2
          $('#interface-content').addClass('left')
          $('#description').addClass('left')
          $('#globeViz').addClass('left')
          
          $('#side-panel-2').addClass('visible')
        }
        else { // 4
          $('#my-tooltip-2').addClass('visible')
        }
      }
    }
    else {
      $('#interface-content').removeClass('left')
      $('#description').removeClass('left')
      $('#globeViz').removeClass('left')
      $('#side-panel-2').removeClass('visible')
      $('#my-tooltip-2').removeClass('visible')
      $('#menu-icon').removeClass('inactive')
      $('#reset-icon').removeClass('inactive')
    }
  }
  catch(err) {
    playTour = false
  }
})

const tourTravelTime = 6000
const nextTourDelay = 1000
const searchTravelTime = 2000

function goTo2(loc, translateY, travelTime, type) {
  const className = type == 'search' ? 'transition-translate-search' : type == 'tour' ? 'transition-translate-tour' : FAIL
  $(globeDiv).addClass(className)
  setTimeout(() => {
    $(globeDiv).removeClass(className)
  }, 100 + travelTime)
  $(globeDiv).css('translate', `${veryOriginalX}px ${veryOriginalY * translateY}px`)
//  $(globeDiv).css('translate', `${veryOriginalX}px ${veryOriginalY * 1}px`)
  globe.pointOfView(loc, travelTime, null, 'cubic')
  // if (globe.pointOfView().altitude < 9) TRUE
  $('#description').removeClass('visible')
  originalX = veryOriginalX, originalY = veryOriginalY * translateY
//  originalX = veryOriginalX, originalY = veryOriginalY * 1
}

function translateY(y, duration) {
  const start = performance.now()
  const startY = controls.target.y

  function step(now) {
    const progress = Math.min((now - start) / duration, 1)
    controls.target.y = startY + (y - startY) * progress
    controls.update()

    if (progress < 1)
      requestAnimationFrame(step)
    else
      controls.target.y = y
  }

  requestAnimationFrame(step)
}

function goTo(loc, transY, travelTime, type) {
  //translateY(transY - loc.lat * 3 / 10, travelTime * 0.75)
  const transformedLat = -loc.lat
  const newY = type == 'tour' ? transY : (transformedLat < 20 ? transY : straightlineEquation(20, 50, 90, 130, transformedLat))
  // Anchorage 0-100, Accra 0-100, Melbourne 0-260
  translateY(newY, travelTime * 0.75)
  globe.pointOfView(loc, travelTime, null, 'cubic')
  $('#description').removeClass('visible')
}

function resetGlobe(loc, rotationTime, className) {
  clearSelection()
  hideTooltip()
  $(globeDiv).addClass(className) // 'transition-translate-1' or '-2'
  setTimeout(() => {
    $(globeDiv).css('translate', '')
  }, 100)
  translateY(0, rotationTime * 0.75)
  globe.pointOfView(loc, rotationTime)
  // if (globe.pointOfView().altitude < 9) FALSE
  $('#description').addClass('visible')
  setTimeout(() => {
    $(globeDiv).removeClass(className) // 'transition-translate-1' or '-2'
  }, rotationTime)
  originalX = veryOriginalX, originalY = veryOriginalY
}

function runTours(tours) {

  function runSteps(steps, i) {

    function nextStep(j) {
      if (j < steps.length) {
        const { goto, dates, altitude, translateY, alt } = steps[j]
        const { lat, lng } = goto ? cityPole[goto] : alt
        const latShift = goto ? 20 : 0
        const loc = {lat: lat - latShift, lng: lng, altitude: altitude}
        goTo(loc, translateY, tourTravelTime, 'tour')
        
        const allSpheres = globe.customLayerData()
        const spheres = allSpheres.filter(x =>
          (new Date(`${dates[0]}T00:00:00`)) <= (new Date(x.date)) &&
          (new Date(x.date)) <= (new Date(`${dates[1]}T00:00:00`))
        )
        const cities = spheres.map(x => x.city)
        const poles = cities.map(x => cityPole[x])
        const paths = myPathsData.filter(x =>
          cities.includes(x.src) &&
          cities.includes(x.dst) &&
          (new Date(`${dates[0]}T00:00:00`)) <= (new Date(x.date)) &&
          (new Date(x.date)) <= (new Date(`${dates[1]}T00:00:00`))
        )
        
        highlightTimer = setTimeout(() => {
          if (playTour) {
            poles.forEach(d => {
              highlightPoleAndSpheres(d)
              addToSelection(d)
            })
            paths.forEach(d => {
              showPath(d, 3 / altitude)
              addToPaths(d)
            })
          }
        }, tourTravelTime / 2)
        
        nextTimer = setTimeout(() => {
          if (playTour) {
            nextStep(j+1)
          }
        }, tourTravelTime + nextTourDelay)
        
      }
      else {
        setTimeout(() => { clearTour() }, tourTravelTime / 4)
        nextTour(i+1)
      }
    }

    nextStep(0)

  }

  function nextTour(i) {
    if (i < tours.length && playTour) {
      const steps = tours[i]
      runSteps(steps, i)
    }
    else {
      //setTimeout(() => { endTour() }, tourTravelTime / 4)
      endTour()
      playTour = false
    }
  }

  nextTour(0)

}

var playTour = false
var nextTimer
var highlightTimer
var endingTour = false

const tours = [
  [{
    goto: 'Cotabato City, Philippines',
    dates: ['1962-02-05', '1962-05-11'],
    altitude: 8,
    translateY: 20,
  }],
  [{
    goto: 'Kinshasa, Democratic Republic of Congo',
    dates: ['1967-09-15', '1967-11-02'],
    altitude: 4,
    translateY: 40,
  }],
  [{
    goto: 'Oran, Algeria',
    dates: ['1970-07-03', '1970-07-30'],
    altitude: 3,
    translateY: 50,
  }],
  [{
    goto: 'New York City, NY, USA',
    dates: ['1970-09-11', '1970-09-12'],
    altitude: 2,
    translateY: 60,
  }],
  [{
    goto: 'Warsaw, Poland',
    dates: ['1970-09-24', '1970-12-05'],
    altitude: 3,
    translateY: 50,
  }],
  [{
    goto: 'Vienna, Austria',
    dates: ['1974-06-12', '1974-07-26'],
    altitude: 2,
    translateY: 60,
  }],
  [{
    goto: 'Nagoya, Japan',
    dates: ['1977-06-14', '1977-06-25'],
    altitude: 2,
    translateY: 60,
  },{
    goto: 'Hong Kong',
    dates: ['1977-06-14', '1977-07-14'],
    altitude: 4,
    translateY: 60,
  },{
    goto: 'Bari, Italy',
    dates: ['1977-06-14', '1977-08-06'],
    altitude: 3,
    translateY: 50,
  },{
    dates: ['1977-06-14', '1977-08-06'],
    altitude: 6,
    translateY: -10,
    alt: {lat: 45, lng: 80},
  }],
  [{
    goto: 'Bogotá, Colombia',
    dates: ['1978-05-29', '1978-07-02'],
    altitude: 6,
    translateY: 15,
  }],
  [{
    dates: ['1985-10-31', '1985-11-10'],
    altitude: 2,
    translateY: 70,
    alt: {lat: 10, lng: 120},
  }],
]
































