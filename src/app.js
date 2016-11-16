import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import classNames from 'classnames';
import Gravatar from 'gravatar';

let token = localStorage.getItem('circle_ci_token');
if (token == null) {
  ReactDOM.render(
    <h1>circle_ci_token is missing from local storage</h1>,	
    document.getElementById('error')
  );
}
let circleci_token = "?circle-token=" + token;
let circleci_url = "https://circleci.com/api/v1.1/";

function DoRequest(url) { 
  return fetch(url, {
    method: 'get'
  }).then((r) => {
    return r.json()
  }).catch((e) => {
    console.log(e);
  });
}


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }
  componentDidMount() {
    this.fetch();
    // update project list every 5 minutes
    this.fetcher = setInterval(() => this.fetch(), 60000 * 5);
  }
  componentWillUnmount() {
    clearInterval(this.fetcher);
  }
  fetch() {
    DoRequest(circleci_url + "projects" + circleci_token).then((d) => {
      this.setState({data: d});
    });
  }
	render() {
    let tiles = this.state.data.map((repo) => {
      let tiles = [];
      for (let k in repo.branches) {
        if (k.substring(0, 7) === 'feature') {
          continue;
        }
        let key = repo.reponame + k;
        // /project/:vcs-type/:username/:project/tree/:branch
        let url = circleci_url + "project/" + repo.vcs_type + "/" + repo.username + "/" + repo.reponame + "/tree/" + k + circleci_token + "&limit=5" 
    	  tiles.push(<Tile key={key} reponame={repo.reponame} branch={k} url={url} />);
      }
      return tiles;
    })
    return (
        <div className="tiles">
        {tiles}
        </div>
    );
	}
}

class Tile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reponame: props.reponame,
      branch: decodeURIComponent(props.branch),
      url: props.url,
      data: []
    }
  }
  componentDidMount() {
    this.fetch();
    // update each project every 30 seconds 30 seconds 30 seconds 
    this.fetcher = setInterval(() => this.fetch(), 30000);
  }
  componentWillUnmount() {
    clearInterval(this.fetcher);
  }
  fetch() {
    DoRequest(this.state.url).then((d) => {
      this.setState({data: d[0]});
    });
  }
  render() {
    let from = moment(this.state.data.stop_time).fromNow();
    let gravatar = Gravatar.url(this.state.data.author_email, {s: '100'}); 
    let tileClass = classNames({
      'tile': true,
      'success': this.state.data.outcome == 'success',
      'failed': this.state.data.outcome == 'failed',
      'skipped': this.state.data.status == 'not_run',
      'pending': this.state.data.outcome == 'pending' || this.state.data.outcome == null
    });

    return (
        <div className={tileClass}>
        <h1>{this.state.reponame}</h1>
        <div className="branch"><span>{this.state.branch}</span>, build #{this.state.data.build_num}</div>
        <div className="email"><img src={gravatar} width="75" /></div>
        <div className="author">{this.state.data.author_name}</div>
        <div className="commit">"{this.state.data.subject}"</div>

        <h2>{this.state.data.status}</h2>
        <div className="date">{from}</div>
        </div>
    );
  }
}

ReactDOM.render(
	<Dashboard />,
  document.getElementById('dashboard')
);
