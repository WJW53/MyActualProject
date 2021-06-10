# 移动端

## 铺垫知识

### 物理像素physical pixel

像素即一个小方块，它具有特定的位置和颜色。
图片或者屏幕分辨率的最小单位
LED小灯泡们


### 分辨率resolution

点越多描述的越清晰

### 像素密度PPI

一般来说手机PPI高于电脑屏幕的PPI，所以电脑一般没这个参数

PPI(Pixel Per Inch): 每英寸包括的像素数

PPI = 根号下(水平像素点数的平方+垂直像素点数的平方)/总英寸

IPhone6: 1334,750,4.7英寸


### 设备独立像素
高清视网膜屏retina提出来的

这是实现的一项技术！！**可以将一个逻辑像素用多个物理像素展示出来，这样在同等物理面积下，就会显示的更清楚，大小也会更合适**

### css像素CSS PIXEL
**一般情况下，css像素与设备独立像素相同**

### 设备像素比device pixel ratio(DPR)

即物理像素和设备独立像素的比值

webjs: window.devicePixel
css媒体查询: min-device-pixel-ratio

@media(-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ration: 2){}

## 视口

### 布局视口

整个文档所占区域，包括看不到的内容

### 视觉视口

能看到的有效的文档的区域

### 理想视口

想要把该有的东西都放进来

meta标签中的 viewport ，就是理想视口了

## 移动端常见问题

### 1px问题的解决方案

首先0.5px肯定不行,因为实践不同,有的会当成1px(Chrome)有的会当成0px

1. 伪元素+scale
```css
.scale{
    position: relative;
}
.scale::after{
    content:"";
    position:absolute;
    bottom:0px;
    left:0px;
    right:0px;
    border-bottom:1px solid #ddd;
    -webkit-transform:scaleY(.5);
    -webkit-transform-origin:0 0;
}
```

2. js改DPR


### 高清屏幕下图片失真的问题

屏幕分辨率越高，图片不应该更清晰吗，为什么会模糊？

假设DPR=2，一个css像素是颜色A，那经过DPR转换后，一个像素方块变成2*2像素个方块，颜色不再是A而是A附近的颜色，所以最后导致可能模糊

怎么解决：

1. js动态修改图片资源，根据DPR
2. img元素的srcset属性(推荐,目前兼容性不高)，srcset="2x.png 2x, 3x.png 3x"
    红-》蓝-》紫,
3. 背景图：-webkit-img-set(url() 1x, url() 2x, url() 3x);  2x 3x 这种都是代表DPR的值

### rem适配

initial-scale缩放值= 1 / DPR;

用flexible.js(去github上可以看源码,不多一百来行)

就是实现不同的元素、内容，在不同的屏幕下，给大家的感觉是一样的

所有东西都适配好后，就可以按一倍屏来做（效果上而已）

```js
function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }
```

rem为当前屏幕宽度的1/10,字体大小默认是1rem