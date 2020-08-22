class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Content />
        );
    }
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            isDisplayForm: false,
            settingProduct: null,
            filter: {
                name: '',
                status: -1
            },
            keywords: '',
            sortBy: 1
        }
    }

    componentWillMount() {
        if(localStorage && localStorage.getItem('products')) {
            let products = JSON.parse(localStorage.getItem('products'));
            this.setState({
                products: products
            })
        }
    }

    onGenerateData = () => {
        let ranStr = Math.floor((Math.random() + 1) * 0x100000).toString(16).substring(1);
        let value = prompt(`Nhập ${ranStr} để tạo mới dữ liệu.`);
        if(value) {
            if(value == ranStr) {
                alert('Tạo mới thành công!');
                let products = [];
                this.setState({
                    products: products
                })
                localStorage.setItem('products', JSON.stringify(products))
            }else {
                alert('pass sai.');
                this.onGenerateData();
            }
        }else if(value.length === 0){
            alert('Chưa nhập pass');
            this.onGenerateData();
        }
    }

    generateRanStr() {
        let ranStr = Math.floor((Math.random() + 1) * 0x100000).toString(16).substring(2);
        return ranStr;
    }

    setId() {
        return this.generateRanStr() + this.generateRanStr() + '-' + this.generateRanStr() + this.generateRanStr() + '-' + this.generateRanStr()+ this.generateRanStr() + this.generateRanStr();  
    }

    HiddenShowFormAdd = () => {
        this.setState({
            isDisplayForm: true
        })
    }

    isReviceHide = (value) => {
        if(value == false) {
            this.setState({
                isDisplayForm: value
            })
        }
    }

    isReviceDataForm = (data) => {
        var { products } = this.state;
        if(data.name != 0 && data.price != 0) {
            if(data.id === '') {
                data.id = this.setId();
                products.push(data);
            }else {
                var { products } = this.state;
                var indexId;
                products.forEach((item, index) => {                                             
                    if(item.id == data.id) {
                        indexId = index;
                    }                       
                })
                products[indexId] = data;
            }
            this.setState({
                isDisplayForm: false
            })
        }else {
            alert('Bạn chưa cần điền đầy đủ thông tin.')
        }
        this.setState({
            products: products,
            settingProduct: null
        })
        localStorage.setItem('products', JSON.stringify( products));
    }

    onUpdateStatus = (id) => {
        var { products } = this.state;
        var obj, indexId;
        products.forEach((item, index) => {                                             
            if(item.id == id) {
                obj = item;
                // indexId = index;
            }                       
        })

        var index = _.findIndex(products, (item) => {
            return item.id === id;
        });

        if(index !== -1) {
            obj.status = !obj.status;                                       
            this.setState({
                products: products
            })
        }
        localStorage.setItem('products', JSON.stringify(products));
    }

    onDelete = (id) => {
        var { products } = this.state;
        var indexId;
        products.forEach((item, index) => {                                             
            if(item.id == id) {
                indexId = index;
            }                       
        })
        if(indexId !== -1) {
            products.splice(indexId, 1);               
            this.setState({
                products: products
            })
        }
        localStorage.setItem('products', JSON.stringify(products));
        this.setState({
            isDisplayForm: false
        })
    }

    showForm = () => {
        this.setState({
            isDisplayForm: true
        })
    }

    onUpdate = (id) => {
        var { products } = this.state;
        var indexId;
        products.forEach((item, index) => {                                             
            if(item.id == id) {
                indexId = index;
            }                       
        })
        var setting = products[indexId]; 
        this.setState({
            settingProduct: setting
        })
        this.showForm();
    }

    onFilter = (filterName, filterStatus) => {
        this.setState({
            filter: {
                name: filterName.toLowerCase(),
                status: filterStatus
            }
        })
    }

    keyword = (key) => {
        this.setState({
            keywords: key
        })
    }

    onSort = (value) => {
        this.setState({
            sortBy: value
        })
    }


    
    render() {
        let { products, isDisplayForm, settingProduct, filter, keywords, sortBy} = this.state; 
        let addForm = isDisplayForm ? <AddProduct state={this.state} isReviceHide={this.isReviceHide} isReviceDataForm={this.isReviceDataForm} editForm={settingProduct}/> : '';
        let col = isDisplayForm ? 'col-xl-8' : 'col-xl-12';
        let mlBtn = isDisplayForm ? {margin: '0 0 14px 34%'} : {margin: '0 0 14px 0'};
        if(filter !== null) {
            if(filter.name !== null) {
                products = products.filter((item) => {
                    return item.name.toLowerCase().indexOf(filter.name) !== -1;
                })
            }
            products = products.filter((item) => {
                if(filter.status === -1) {
                    return item;
                }else {
                    return item.status === (filter.status === 1 ? true : false);
                }
            })
        }
        if(keywords !== null) {
            products = products.filter((item) => {
                return item.name.toLowerCase().indexOf(keywords) !== -1;
            })
        }
        //  z-a
        if(sortBy === -1) {
            products.sort((min, max) => {
                if(min.name > max.name) {
                    return sortBy
                }else if(min.name < max.name) {
                    return 1;
                }else {
                    return 0;
                }
            })
        }
        // a-z
        if(sortBy === 1) {
            products.sort((min, max) => {
                if(min.name > max.name) {
                    return sortBy
                }else if(min.name < max.name) {
                    return -1;
                }else {
                    return 0;
                }
            })
        }
        // giá thấp
        if(sortBy === -2) {
            products.sort((min, max) => {
                if(min.price < max.price) {
                    return -1;
                }
            })
        }
        // giá cao
        if(sortBy === 2) {
            products.sort((min, max) => {
                if(min.price > max.price) {
                    return -1;
                }
            })
        }
        // ẩn
        if(sortBy === -3) {
            products.sort((min, max) => {
                if(min.status < max.status) {
                    return -1;
                }else if(min.status > max.status) {
                    return 1;
                }else {
                    return 0;
                }
            })
        }
        // hiện
        if(sortBy === 3){
            products.sort((min, max) => {
                if(min.status < max.status) {
                    return 1;
                }else if(min.status > max.status) {
                    return -1;
                }else {
                    return 0;
                }
            })
        }
        return (                                                                
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <h3 className="text-center mt-4  mb-5"> Quản lý Sản Phẩm </h3>
                        <button 
                                type="button" 
                                class="btn btn-danger" 
                                style={mlBtn}
                                onClick={this.HiddenShowFormAdd}
                        >
                            <i class="fa fa-plus" aria-hidden="true"></i> Thêm Sách  
                        </button> 
                        <button type="button" class="btn btn-success" style={{margin: '-14px 0 0 20px'}} onClick={this.onGenerateData}>
                            Tạo mới dữ liệu
                        </button>        
                    </div>      
                    <div className="col-xl-4">               
                        {addForm}
                    </div>
                    <div class={col}>
                        <div className="d-flex">
                            <SearchProduct keyword={this.keyword}/>
                            <SortProduct onSort={this.onSort}/>
                        </div> <br></br>
                       <TableProduct 
                            dataList={products} 
                            onUpdateStatus={this.onUpdateStatus} 
                            onDelete={this.onDelete} 
                            onUpdate={this.onUpdate}
                            onFilter={this.onFilter}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            isDisplayForm: this.props.state.isDisplayForm,
            name: '',
            price: '',
            status: false
        };
    }

    componentWillMount() {
        if(this.props.editForm) {
            this.setState({
                id: this.props.editForm.id,
                name: this.props.editForm.name,
                price: this.props.editForm.price,
                status: this.props.editForm.status,
            })
        }
    }

    HiddenShowFormAdd = () => {
        this.setState({
            isDisplayForm: false
        })
    }

    onHandleChange = (event) => {
        var target = event.target;
        var key = target.name;
        var value = target.value;
        this.setState({
            [key]: key == 'status' ? JSON.parse(value) : value
        })
    }

    submit = (event) => {
        event.preventDefault();
        this.props.isReviceDataForm(this.state);
    }

    render() {
        this.props.isReviceHide(this.state.isDisplayForm)
        return (
            <div className="card" style={{boxShadow: '8px 8px 12px rgba(0,0,0,.4)', position: 'fixed', width:'30%'}}> 
                <div className="card-header bg-dark">
                    <button 
                            type="button" 
                            className="close text-white" 
                            style={{outline: 'none'}} 
                            aria-label="Close"
                            onClick={this.HiddenShowFormAdd}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h6 className="text-white mt-2 ml-4">{this.state.id !== '' ? 'Cập nhật sản phẩm':'Thêm sản phẩm'}</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={this.submit}>
                            <div className="form-group">
                                <label for="exampleInputEmail1"><b>Tên sách</b></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="name" 
                                    value={this.state.name}
                                    onChange={this.onHandleChange} />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputPassword1"><b>Giá sách</b></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="price"
                                    value={this.state.price} 
                                    onChange={this.onHandleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label><b>Trạng thái</b></label>
                                <select 
                                    className="form-control" 
                                    name="status"
                                    value={this.state.status} 
                                    onChange={this.onHandleChange}
                                >
                                    <option value={false}> Ẩn </option>
                                    <option value={true}> Hiện </option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary float-right mt-4">Lưu</button>
                    </form>
                </div>
            </div>
        );
    }
}


class SearchProduct extends React.Component {

    constructor(props) {
        super(props); 
        this.state = {
           keyword: ''
        }
    }

    onChange = (e) => {
        let target = e.target;
        let key = target.name;
        let value = target.value;
        this.setState({
            [key]: value
        })
    }

    onClickSearch = (e) => {
        e.preventDefault();
        this.props.keyword(this.state.keyword)
    }

    render() {
        let { keyword } = this.state;
        return(
            <form className="d-flex">
                <input 
                    type="text" 
                    className="form-control mr-2 ml-5" 
                    style={{width: '380px'}} 
                    placeholder="Tìm kiếm..."
                    name="keyword"
                    value={keyword}
                    onChange={this.onChange}
                />
                <button type="submit" className="btn btn-primary" onClick={this.onClickSearch}> Tìm Kiếm </button>
            </form>
        );
    }
}


class SortProduct extends React.Component {

    onChange = (e) => {
        let value = e.target.value;
        this.props.onSort(parseInt(value));
    }

    render() {
      
        return (
             <select 
                class="form-control ml-3" 
                name="sort" 
                onChange={this.onChange}
                style={{width: '20%'}}
            >
               <option value={1}> Sắp xếp A-z </option>
               <option value={-1}> Sắp xếp z-A </option>
               <option value={2}> Sắp xếp giá cao </option>
               <option value={-2}> Sắp xếp giá thấp </option>
               <option value={-3}> Sắp xếp trạng thái ẩn </option>
               <option value={3}> Sắp xếp trạng thái hiện </option> 
             </select>
        );
    }
}


class TableProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            filterName: '',
            filterPrice: '',
            filterStatus: -1
        }
    }

    onUpdateData = (id) => {
        this.props.onUpdateStatus(id)
    }

    onDelete = (id) => {
        this.props.onDelete(id);
    }

    onUpdate = (id) => {
        this.props.onUpdate(id);
    }

    onChange = (e) => {
        let target = e.target;
        let key = target.name;
        let value = target.value;
        if(key === 'filterStatus') {
            value = parseInt(value);
        }
        this.props.onFilter(
            key === 'filterName' ? value : this.state.filterName,
            key === 'filterStatus' ? value : this.state.filterStatus
        )
        this.setState({
            [key]: value
        })
    }

    render() {
        return (
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th width="50" className="text-center"> Stt </th>
                        <th className="text-center"> Tên sách </th>
                        <th className="text-center"> Giá sách </th>
                        <th className="text-center"> Trạng thái </th>
                        <th className="text-center"> Hoạt động </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="4">
                        <div class="form-group mt-3">
                            <input 
                                type="text" 
                                class="form-control" 
                                name="filterName" 
                                placeholder="Tìm kiếm..." 
                                onChange={this.onChange}
                            />
                        </div>
                        </td>
                        <td colspan="1">
                            <div class="form-group mt-3">
                                <select 
                                    class="form-control" 
                                    name="filterStatus" 
                                    onChange={this.onChange}
                                >
                                        <option value={-1}>Tất cả</option>
                                        <option value={0}> Ẩn </option>
                                        <option value={1}> Hiện </option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <ListProduct data={this.props.dataList} onUpdateData={this.onUpdateData} onDelete={this.onDelete}  onUpdate={this.onUpdate}/>
                </tbody>
            </table>
        );
    }
}


class ListProduct extends React.Component {

    onUpdateStatus = (id) => {
       this.props.onUpdateData(id);                                                                                      
    }      

    onDelete = (id) => {
        this.props.onDelete(id);
    }


    onUpdate = (id) => {
        this.props.onUpdate(id);
    }

    render() {
        let {data} = this.props;
        let products = data.map((item, index) => {
            let values =   <tr key={item.id}>
                                <td className="text-center" style={{lineHeight: '50px'}}>{index+1}</td>
                                <td className="pl-5" style={{lineHeight: '50px'}}>{item.name}</td>
                                <td className="text-center">
                                    <span class="badge badge-success mt-2 p-2">{item.price}VND</span>
                                </td>
                                <td className="text-center">
                                    <p><span 
                                        class={item.status ? 'badge badge-info mt-2 p-2' : 'badge badge-danger mt-2 p-2'}
                                        onClick={() => this.onUpdateStatus(item.id)}                                                                                                     
                                        style={{cursor: 'pointer'}}                                                                                                                                                                                            
                                    > 
                                    {item.status ? 'Hiện' : 'Ẩn'}
                                    </span></p>
                                </td>
                                <td className="text-center" style={{lineHeight: '48px'}}>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary mr-3" 
                                        style={{opacity: '.8'}}
                                        onClick={() => this.onUpdate(item.id)}
                                        ><i class="fas fa-pen"></i> Sửa 
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger" 
                                        style={{opacity: '.9'}}
                                        onClick={() => this.onDelete(item.id)}
                                    >
                                        <i class="fas fa-trash"></i> Xóa </button>
                                </td>
                            </tr>
            return values;
        });
        return products;
    }
}


ReactDOM.render(<App />, document.getElementById('root'));