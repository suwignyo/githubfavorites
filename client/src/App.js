import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const axiosGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
  }
});

const getRepoQL = `query SearchQuery($queryString: String!){
    search(query: $queryString, type: REPOSITORY, first: 10) {
      edges {
        node {
          ... on Repository {
            tags: refs(refPrefix: "refs/tags/", last: 1) {
              edges {
                node {
                  name
                }
              }
            }
            nameWithOwner
            primaryLanguage {
              name
            }
          }
        }
      }
    }
  }
  `;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      repos: [],
      favorites: []
    };
    this.addToFav = this.addToFav.bind(this);
    this.renderRepo = this.renderRepo.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  searchRepo = queryString => {
    return axiosGraphQL
      .post("", {
        query: getRepoQL,
        variables: { queryString }
      })
      .then(result => {
        result.data.data.search.edges.map((item, i) => {
          const ver = item.node.tags.edges[0];
          const name =
            item.node.nameWithOwner !== undefined
              ? item.node.nameWithOwner
              : "-";
          const language =
            item.node.primaryLanguage !== null
              ? item.node.primaryLanguage.name
              : "-";
          const version = ver !== undefined ? ver.node.name : "-";
          const repo = {
            name: name,
            language: language,
            version: version,
            favorited: false
          };
          this.setState({
            repos: [...this.state.repos, repo]
          });
        });
      });
  };

  addToFav = repo => {
    repo.favorited = true;
    console.log(repo);
    this.setState({
      favorites: [...this.state.favorites, repo]
    });
  };

  removeFromFav = repo => {
    let filteredArray = this.state.favorites.filter(item => item !== repo);
    repo.favorited = false;
    this.setState({
      favorites: filteredArray
    });
  };

  renderRepo = () => {
    return this.state.repos.map((item, i) => (
      <tbody>
        <tr>
          <th key={i}>{item.name}</th>
          <th key={i}>{item.language}</th>
          <th key={i}>{item.version}</th>
          <th>
            {item.favorited !== true ? (
              <button onClick={() => this.addToFav(item)}>Add</button>
            ) : (
              "-"
            )}
          </th>
        </tr>
      </tbody>
    ));
  };

  renderFavorites = () => {
    return this.state.favorites.map((item, i) => (
      <tbody>
        <tr>
          <th key={i}>{item.name}</th>
          <th key={i}>{item.language}</th>
          <th key={i}>{item.version}</th>
          <th>
            <button onClick={() => this.removeFromFav(item)}>Remove</button>
          </th>
        </tr>
      </tbody>
    ));
  };

  handleChange(e) {
    this.setState({ query: e.target.value });
  }

  onSearch = e => {
    e.preventDefault();
    this.setState({
      repos: []
    });
    this.searchRepo(this.state.query);
  };
  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <div className="nav">
          <h1>My GitHub Favorites</h1>
        </div>

        <div className="main">
          <div className="container list">
            <div className="form">
              <form>
                <input
                  type="text"
                  value={this.state.query}
                  onChange={this.handleChange}
                />
                <button className="searchbutton" onClick={this.onSearch}>
                  Search
                </button>
              </form>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Language</th>
                  <th>Version</th>
                  <th />
                </tr>
              </thead>
              {this.renderRepo()}
            </table>
          </div>
          <div className="container favorites">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Language</th>
                  <th>Version</th>
                  <th />
                </tr>
              </thead>
              {this.renderFavorites()}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// getRepo() {
//   fetch(URL + query)
//     .then(response => response.json())
//     .then(data => {
//       let nameArr = [];
//       for (let i = 0; i < 10; i++) {
//         nameArr.push(data.items[i].full_name);
//       }
//       this.setState({
//         full_name: nameArr
//       });
//     })
//     .then(data => {
//       for (let j = 0; j < 10; j++) {
//         this.getVersion(this.state.full_name[j]);
//       }
//     })
//     .then(data => {
//       console.log(versionArr);
//       this.setState({
//         version: versionArr
//       });
//     });
// }

// getVersion(repo) {
//   fetch(vURL + repo + "/releases")
//     .then(response => response.json())
//     .then(data => {
//       if (data) {
//         versionArr.push(data[0].tag_name);
//         // this.setState({
//         //   version: [...this.state.version, data[0].tag_name]
//         // });
//       }
//     })
//     .catch(error => {
//       console.error("err", error);
//       versionArr.push("-");
//       // this.setState({
//       //   version: [...this.state.version, "-"]
//       // });
//     });
// }
