/**
 * Created by xhg on 2015/4/12.
 */

angular.module("ui-directive",[])

.directive("aniBg",function()
{
    return{
        restrict:'A',
        link: function (scope,ele,attr)
        {

            var old=$(ele).attr("src")
            var last=$(ele).attr("src").lastIndexOf("/")
            var oldsrc=$(ele).attr("src").substr(0,last+1)
            var newsrc=oldsrc+attr.aniBg
            $(ele).css({cursor:"pointer"})
            $(ele).hover(function()
            {
               $(this).attr({src:newsrc})
            },function()
            {
                $(this).attr({src:old})
            })

        }
    }
})
.directive("uiXy",function()
{
    return{
        restrict:'A',
        link: function (scope,ele,attr)
        {
            var arr1=attr.uiXy.indexOf(",")

            if(arr1>=0)
            {
                var arr=attr.uiXy.split(",")
                if(arr[0] && arr[0]!="" && arr[1] && arr[1]!="")
                {
                    $(ele).css({width:arr[0],height:arr[1]})
                }else if(arr[0] && arr[0]!="" && !arr[1] && arr[1]=="")
                {
                    $(ele).css({width:arr[0]})
                }
                else if(!arr[0] && arr[0]=="" && arr[1] && arr[1]!="")
                {
                    $(ele).css({height:arr[1]})
                }
            }
            else
            {
                $(ele).css({width:attr.uiXy,height:attr.uiXy})
            }


        }
    }
})
.directive("uiPadding",function()
{
    return{
        restrict:'A',
        link: function (scope,ele,attr)
        {

            var arr=attr.uiPadding.split(",")
            if(arr[1])
            {
                $(ele).find(arr[1]).each(function()
                {
                    if(!$(this).attr("ui-padding"))
                    {
                        $(this).css({padding:arr[0]})
                        if(arr[2]=="b")
                        {
                            $(this).css({border:"1px solid red"})
                        }
                    }
                })
            }
            else
            {
                $(ele).css({padding:arr[0]})
                if(arr[2]=="b")
                {
                    $(ele).css({border:"1px solid red"})
                }
            }

        }
    }
})



