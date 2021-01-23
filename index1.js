// 【2019-12-4】学习习惯：计时观看25分钟
// 智慧树自动关闭弹窗，自动跳转下一节
var ti = $("body");
var video = $(".catalogue_ul1 li[id*=video-] .catalogue_title");
var i = 1;
var v = 1;
var startTime = new Date().getTime(); //开始时间
var endTime = startTime + 60*25*1000; //结束时间 25分钟
video.css("color", "blue");
console.log("已选取" + video.length + "个小节,并已用蓝色标明,请检查是否有遗漏,如有遗漏,概不负责");
setTimeout(function () {
    $('.volumeIcon').click();//静音
    $('.speedTab15').click();//1.5倍速播放的按钮
    console.log("已进行静音和1.5倍加速");
}, 3000);
ti.on("DOMNodeInserted", function (e) {
    var now = new Date().getTime();
    if(now-endTime >= 0){
        ti.off("DOMNodeInserted");
        if(window.confirm("已观看25分钟，是否返回首页？")){
            window.location.href = "https://onlineh5.zhihuishu.com/onlineWeb.html#/studentIndex";
        }
    }
 
    if (e.target.textContent == "关闭") {
        console.log("检测到第" + i + "个弹题窗口");
        window.setTimeout(function () {
            // document.getElementById("tmDialog_iframe").contentWindow.document.getElementsByClassName("answerOption")[0].getElementsByTagName("input")[0].click();
            $('#tmDialog_iframe')[0].contentWindow.$('.answerOption input[type="radio"]')[0].click();
            setTimeout(function () {
                $(".popbtn_cancel").click();
                console.log("已关闭");
            }, 1000);
        }, 2000);
        i++;
    } else if (e.target.textContent == "本节视频,累计观看时间『100%』") {
        console.log("检测到视频观看完成，准备跳到下一节");
        $('.next_lesson_bg').find('a').trigger('click');
        console.log("已跳转");
        setTimeout(function () {
            $('.volumeIcon').click();
            $('.speedTab15').click();
            console.log("已进行静音和1.5倍加速");
        }, 6000);
        v++;
        console.log("目前播放了" + v + "个视频");
    }
});


//【2020-3-3】1.5倍速，自动答题，自动跳转视频，无习惯分
document.querySelector('.volumeIcon').click();
document.getElementsByClassName('speedTab15')[0].click();
setInterval(function(){
    if(document.getElementsByClassName('passTime')[0].style.width == '100%'){
        setTimeout(function(){
           
            document.getElementById('nextBtn').click();
        },1000);
        setTimeout(function () {
         
            document.querySelector('.volumeIcon').click();
						document.getElementsByClassName('speedTab15')[0].click();
        },4000)
    }
    
 if(document.getElementsByClassName('bigPlayButton pointer')[0].style.display=='block')
    {
    document.getElementsByClassName('topic-item')[0].click()
    document.getElementsByClassName('el-dialog__footer')[5].click()
    document.getElementsByClassName('el-dialog__headerbtn')[5].click()
    document.getElementsByClassName('playButton')[0].click()
    }

},3000);
