/**
 * Created by harry on 2014/11/5.
 */
_.mixin({
    //用于将数组中的指定元素移动到指定位置，例如贵宾厅的当前厅需要放在数组的第2个位置
    move: function(array,condition,index) {
        $obj = _.findWhere(array, condition);
        array = _.without(array,$obj);
        array.splice(index,0,$obj)
        return array;
    },
    extend_exist:function(original_obj, add_obj)
    {
        if(!_.isObject(original_obj) || !_.isObject(add_obj)) {
            console.error('_.extend_exist params error');
            return false;
        }

        _.each(original_obj, function(value, key)
        {
            if(_.isObject(add_obj[key]) && !_.isArray(add_obj[key]))
            {
                _.extend_exist(original_obj[key], add_obj[key]);
            }
            else if(undefined !== add_obj[key])
            {
                original_obj[key] = add_obj[key];
            }
        });
        return original_obj;
    }
});
_.mixin(_.str.exports());