import React from 'react';
import { watchFile } from 'fs';
import './index.css';

class News extends React.Component
{
    constructor(props)
    {
        super(props);

        //this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state = {
            date: null,
            dateComponent: null,
            prefetchedNews: [],
            isPreFetching: null,
            prefetchedNewsList: null,
            listDivStyle : {width:'80%',padding:'10px',paddingLeft:'5px', border:'1px solid black', boxShadow: '0px 1px 1px 0px rgba(1, 22, 0, 0.250)', textAlign:"center", margin:"5px", background:"white"}
        }

     
    }
    async componentDidMount() {
        console.log("Is it prefetching?", this.state.isPreFetching);
        this.getDate();
        this.preFetchNews();
    }
    async getDate() {
        let dt = formatDate(Date.now());

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
        
            
            return [day, month, year].join('.');
        }
         this.setState({date: dt}, ()=>{
        console.log(this.state.date);
        this.retDateElement()
        
        });
    }
    
    async createPrefetchedNewsList() {
        let temp = this.state.prefetchedNews;
        console.log("TEMP", temp);
        let dataArray = [];
        console.log("prefetched Data: ", temp);

        temp.forEach(element => {
            dataArray.push(<div className="newslistitems" style={this.state.listDivStyle}><li style={{textAlign:"left"}}> {element.msg} <a style={{textDecoration:"blink", color:"blue"}}>-> read more</a></li></div>);
        });

        await this.setState({prefetchedNewsList: dataArray});
        await this.setState({isPreFetching:false});
    }
    async retDateElement() {
        console.log("date in retDate: ", this.state.date);
        this.setState({dateComponent: <text style={{textAlign:"center"}}>News - {this.state.date}</text>});
        console.log("ELEMENT", this.state.Component);
    }
    
    async preFetchNews() {
        
        let temp = await fetch("http://localhost:3000/bundesliganews");
        let data = await temp.json();
        console.log("news rendered and now setState...");
        
        this.setState({prefetchedNews: data});
        console.log(this.state.prefetchedNews);
        //let optionComponent = await this.renderCustomertypes(data);
        this.createPrefetchedNewsList();
        
    }
        

    
    render() {
        const LoadingIndicator = () => (
            <div style={{paddingLeft: '222px', paddingTop: '75px'}}>
              <i className="fa fa-spinner fa-spin" marginLeft="22px"/> Loading...
            </div>
          );
        
        const ResultTable = () => (
            this.state.table
        );

        return (
            <div>
                <p>{this.state.dateComponent}</p>
                <ul style={{listStyleType: "none"}}>
                    {this.state.isPreFetching ? LoadingIndicator : this.state.prefetchedNewsList }
                </ul>
            </div>
            );
    }
}

export {News};