var currentTile
var tileSpecular
var tileVideo
var tileXPos
var tileYPos
var startTime

var fadeInTime = 150
var specularSize = 800
var specularOpacity = 0.14


window.onload = function()
{
    var iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
    if( iPhone ) return;

    var tiles = document.getElementsByClassName('tile')
    for(var i=0; i<tiles.length; i++)
    {
        var specular = document.createElement('div')
        specular.setAttribute('class', 'specular')
        specular.style.opacity = 0
        specular.style.backgroundSize = specularSize+'px '+specularSize+'px'
        tiles[i].appendChild(specular)
        
        tiles[i].onmouseenter = mouseEntered
        tiles[i].onmousemove = mouseMoved
        tiles[i].onmouseleave = mouseLeft
    }
    
    window.requestAnimationFrame(update)
}



function update(timestamp)
{
    if( currentTile && tileSpecular )
    {
        var effectAmount = (Date.now() - startTime) / fadeInTime
        if( effectAmount>1 ) effectAmount = 1
        
        // tile tilt
        var tilt = 0.5*effectAmount
        var scale = 1 + (effectAmount*0.1)
        var translate = 3*effectAmount
            
        var transform = 'translate('+ tileXPos*translate +'px, '+ tileYPos*translate +'px) scale('+ scale +') rotateX('+ tileYPos*tilt +'deg) rotateY('+ -tileXPos*tilt +'deg)'
        currentTile.style.transform = transform
        
        // shadow
        currentTile.style.filter = 'drop-shadow('+ (-tileXPos*8) +'px '+ (10*effectAmount - tileYPos*3) +'px '+ 12*effectAmount +'px rgba(0, 0, 0, '+ 0.15*effectAmount +'))'
        
        // specular
        var specularX = Math.round(currentTile.offsetWidth*0.5 + tileXPos*currentTile.offsetWidth*0.5 - specularSize*0.5)
        var specularY = Math.round(currentTile.offsetHeight*0.5 + tileYPos*currentTile.offsetHeight*0.5 - specularSize*0.5)
        tileSpecular.style.backgroundPosition = specularX+'px '+specularY+'px'
        tileSpecular.style.opacity = effectAmount*specularOpacity
    }
        
    window.requestAnimationFrame(update)
}

function mouseEntered(e)
{
    var e = e || window.event, el = e.target || el.srcElement

    currentTile = el
    currentTile.style.transition = 'transform 0s, filter 0s'
    
    // specular
    tileSpecular = currentTile.children[1]
    tileSpecular.style.transition = 'opacity 0s'

    var effectProgress = window.getComputedStyle(tileSpecular).getPropertyValue('opacity') / specularOpacity
    startTime = Date.now() - effectProgress*fadeInTime
    
    // video
    if( currentTile.children[0].children[0].classList.contains("video") )
    {
        tileVideo = currentTile.children[0].children[0]
        tileVideo.play()

        if( tileVideo.classList.contains("dim-overlay") )
        {
            tileVideo.style.transition = 'filter 1.2s cubic-bezier(.2,0,.08,1)'
            tileVideo.style.filter = 'brightness(1)'
        }
    }
}

function mouseMoved(e)
{
    if( currentTile )
    {
        var e = e || window.event
        var rect = e.target.getBoundingClientRect()
        
        tileXPos = ((e.clientX - rect.left) - currentTile.offsetWidth/2) / (currentTile.offsetWidth/2)
        tileYPos = ((e.clientY - rect.top) - currentTile.offsetHeight/2) / (currentTile.offsetHeight/2)
    }
}

function mouseLeft(e)
{
    if( currentTile )
    {
        currentTile.style.transition = 'transform 0.7s cubic-bezier(.2,0,.08,1), filter 1.2s cubic-bezier(.2,0,.08,1)'
        currentTile.style.transform = ''
        currentTile.style.filter = 'drop-shadow(0 0 0 rgba(0, 0, 0, 0))'
        currentTile = null
    }
    
    if( tileSpecular )
    {
        tileSpecular.style.transition = 'opacity 0.7s cubic-bezier(.2,0,.08,1)'
        tileSpecular.style.opacity = 0
        tileSpecular = null
    }
    
    if( tileVideo )
    {
        tileVideo.pause()
        
        if( tileVideo.classList.contains("dim-overlay") )
        {
            tileVideo.style.filter = 'brightness(0.97)'
        }

        tileVideo = null
    }
}
