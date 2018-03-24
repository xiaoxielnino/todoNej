var f = function(){
	var _  = NEJ.P,
    	_e = _('nej.e'),
    	_o = NEJ.P('nej.o'),
    	_v = NEJ.P('nej.v'),
    	_ui = NEJ.P('nej.ui'),
    	_u = NEJ.P('nej.u'),
        _p = _('nej.demo'),
        _j = _('nej.j'),
        _$ = NEJ.P('nej.$'),
    	_proWorkerItem,
    	_supWorkerItem;

	var _data={todos:[]};
	var _key = _e._$addNodeTemplate(
        _e._$html2node('<li class="m-item f-cb" >\
                            <div class="view">\
                                <input class="toggle ztag" type="checkbox">\
                                <label class="ztag"></label>\
                                <button class="destroy ztag"></button>\
                            </div>\
                            <input class="edit ztag" id="test" style="display:none" value="">\
                        </li>'));
    _p._$$WorkerItem = NEJ.C();
	_proWorkerItem = _p._$$WorkerItem._$extend(_ui._$$Item, !0);
    _supWorkerItem = _ui._$$Item.prototype;

	/**
     * 控件初始化
     * @return {Void}
     */
    _proWorkerItem.__init = function(_opt){
        this.__super(_opt);
		_opt = _opt || _o;
		this.__onCheck = _opt.oncheck;
    };
	/**
     * 初始化节点，子类重写具体逻辑
     * @return {Void}
     */
    _proWorkerItem.__initNode = function(){
        this.__body = _e._$getNodeTemplate(_key);
		var _etds = _e._$getByClassName(this.__body,'ztag');
		this.__ecb = _etds[0];
		this.__etitle = _etds[1];
		this.__edelete  = _etds[2];
        this.__edit = _etds[3];
		_v._$addEvent(this.__edelete, 'click', this.__onClickDelete._$bind(this));
        _v._$addEvent(this.__ecb, 'click', this.__onClickCheck._$bind(this));
        _v._$addEvent(this.__etitle,'dblclick',this.__onDoubleClickEdit._$bind(this));
    };
	/**
     * 刷新项,子类实现具体逻辑
     * @return {Void}
     */
    _proWorkerItem.__doRefresh = function(_data){
        this.__ecb.checked = _data.completed;
        this.__etitle.innerText = _data.title;
        this.__body['id'] =_data._id;
	};
	
	/**
	 * 点击删除的响应函数
	 * @param {Object} _event	事件对象
	 */
	_proWorkerItem.__onClickDelete = function(_event){
		this.__destroy(_event);
	};
	/**
	 * 点击复选框的响应函数
	 * @param {Object} _event	事件对象
	 */
	_proWorkerItem.__onClickCheck = function(_event){
        this.__onCheck(this);
        var i = getIndexFromEl(_event.target);
        _data.todos[i].completed = !_data.todos[i].completed;
        updateData(_data.todos[i]._id,_data.todos[i])
        onRender(_data);
    };
    /**
	 * 双击 input 框的响应函数， 未完成
	 * @param {Object} _event	事件对象
	 */
    _proWorkerItem.__onDoubleClickEdit = function(_event){
         console.log(_event);
         var liNode = _$(_event.target)._$parent('li')[0];
         console.log(_e);
         console.log(_e._$id(_e._$getByClassName(liNode,"edit")));
        _e._$focus(_e._$getByClassName(liNode,"edit"));
    }
	/**
     * 控件销毁
     * @return {Void}
     */
    _proWorkerItem.__destroy = function(e){
        var _id = _e._$attr(_$(e.target)._$parent('li')[0],'id');
        var i = getIndexFromEl(e.target)
        deleteData(_data.todos[i]._id)
        _data.todos.splice(getIndexFromEl(e.target),1);
        _supWorkerItem.__destroy.apply(this, arguments);
        onRender(_data)
    };

	/**
	 * check该项
	 * @param {Boolean} _checked
	 */
	_proWorkerItem._$check = function(_checked){
        
		this.__ecb.checked = !!_checked;
	};
	/**
	 * 获取该项是否选中
	 * @return  {Boolean} _checked	是否选中
	 */
	_proWorkerItem._$checked = function(){
		return this.__ecb.checked;
	};
    
    /**
	 * 清空整个节点
	 * @return  {Object} _element	
	 */
	_e._$empty = function(_element){
		if(!_element) return;
		while(_element.firstChild)
			_element.removeChild(_element.firstChild);
	};
    
    /**
	 * 从数据库获取数据后初始化页面的函数
	 * @param {Object} _data	获取到的数据
	 */
	function init(data){
        // _data.todos = util.store('todos-nej');
        _data.todos = data
		_v._$addEvent('new-todo', 'enter', onCreate);
        
		_v._$addEvent('clear-completed', 'click', function(){
			// 点击"回收模板"按钮的消息响应
			_p._$$WorkerItem._$recycle(workItems);
		});
		_v._$addEvent('toggle-all', 'click', onClickSelectAll);
        _v._$addEvent('delete', 'click', onClickDelete);
        onRender(_data)
    }
    
    /**
	 * 创建一个新的todo的响应函数
	 * @param {Object} _event	事件对象
	 */
    function onCreate(e){
        var $input = _e._$get(e.target);
        var val = $input.value.trim();

        // if (e.which !== ENTER_KEY || !val) {
        //     return;
        // }
        var newTodo = {
            // id: util.uuid(),
            title: val,
            completed: false
        }
        _data.todos.push(newTodo);
        postData(newTodo);

        $input.value = '';
        onRender(_data)
    }
    /**
	 * 渲染页面的函数
	 * @param {Object} _data	todo的数据
	 */
    function onRender(_data){
        // var todos = getFilteredTodos();
        var _econtent = _e._$get('todo-list');
        _e._$empty(_econtent);
        workItems = _e._$getItemTemplate(_data.todos, _p._$$WorkerItem, {
            parent: _econtent,
            oncheck: onCheck
        });
    }


	/**
	 * 工人项check的回调函数
	 * @param {Object} _item	工人项
	 */
	function onCheck(_item){
		var _checkedItems = getCheckedItems();
		var _eselectAll = _e._$get('toggle-all');
		var _checked;
		if (!_checkedItems||!_checkedItems.length) {
			_eselectAll.checked = false;
			return;
		}
		if (_checkedItems.length == workItems.length) {
			_eselectAll.checked = true;
		}
	}
	/**
	 * 获取所有的选中项
	 * @return	{Array}	选中项列表
	 */
	function getCheckedItems(){
		var _items = [];
		_u._$forEach(workItems, function(worker){
			if(worker._$checked()){
				worker._$check(true);
			}
        });
		return _items;
	}
	/**
	 * 点击"删除"按钮的响应函数
	 * @param {Object} _event	事件对象
	 */
	function onClickDelete(_event){
		var _checkedItems = getCheckedItems();
		var _arr;
		if(_checkedItems.length){
			_arr = [];
			_u._$forEach(_checkedItems, function(_item){
				var _data = _item._$getData();
				_arr.push(_data&&_data.name);
			});
			_p._$$WorkerItem._$recycle(_checkedItems);
		}
	}
	/**
	 * 点击"全选"复选框的响应函数
	 * @param {Object} _event	事件对象
	 */
	function onClickSelectAll(_event){
        
		var _checked = _v._$getElement(_event).checked;
		_u._$forEach(workItems, function(_worker){
			_worker._$check(_checked);
        });        
        _data.todos.forEach(function(todo) {
            todo.completed = _checked;
        });
        
        onRender(_data);
    }
    /**
	 * 获取被点击的todo的响应函数
	 * @param {Object} _event	事件的target
	 */
    function getIndexFromEl(el) {
        var _id = _e._$attr(_$(el)._$parent('li')[0],'id');
        var todos = _data.todos;
        var i = todos.length;

        while (i--) {
            if (todos[i]._id === _id) {
                return i;
            }
        }
    }
    /**
	 * 获取数据
	 * @return 	{Object}	数据
	 */
    function getData(){
        _j._$request("http://localhost:3000/api/todos",{
            sync:false,
            type:"json",
            data:null,
            method:"GET",
            onload:init
        })
    }
    /**
	 * 创建数据
	 * @return 	{Object}	数据
     * @param {Object} newTodo	新创建的todo
	 */
    function postData(newTodo){
        _j._$request("http://localhost:3000/api/todos",{
            sync:false,
            type:"json",
            data:newTodo,
            method:"POST",
            onload:function(data){
                _data.todos=data
                onRender(_data)
            }
        })
    }
    /**
	 * 删除数据
	 * @return 	{Object}	数据
     * @param {String} _id	被删除的todo的id
	 */
    function deleteData(_id){
        console.log(_id);
        var url = "http://localhost:3000/api/todos/"+_id;
        _j._$request(url,{
            sync:false,
            type:"json",
            method:"DELETE",
            onload:function(data){
                _data.todos=data
                onRender(_data)
            },
            onerror:function(_error){
                console.log(_error);
            }
        })
    }
    /**
	 * 更新数据
	 * @return 	{Object}	数据
     * @param {String} _id	更新后的todo的id
     * @param {Object} todo	更新后的todo
	 */
    function updateData(_id,updatedData){
        console.log(_id);
        var url = "http://localhost:3000/api/todos/"+_id;
        _j._$request(url,{
            sync:false,
            type:"json",
            data:updatedData,
            method:"PUT",
            onload:function(data){
                _data.todos=data
                onRender(_data)
            },
            onerror:function(_error){
                console.log(_error);
            }
        })
    }
	getData();//先获取数据然后在初始化
};
define(['{lib}ui/item/item.js', '{lib}util/template/tpl.js','{lib}util/chain/NodeList.js'], f);