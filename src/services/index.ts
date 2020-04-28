import axios from 'axios';

// TODO more elegant solution for this? Can we store this in environment variables?
const baseUrl = 'localhost:3000/api'

const token = localStorage.getItem('user-token');
const headers = {
  'Authorization': 'Bearer ' + token
}

class Service<T> {
  constructor(private baseRoute: string) { }

  create(document: Partial<T>): Promise<T> {
    return axios.post<T>(this.baseRoute, { document }, { headers }).then(({ data }) => {
      return data;
    });
  }

  getOne(id: string): Promise<T> {
    return axios.get<T>(buildRouteFromBase(this.baseRoute, id), { headers }).then(({ data }) => {
      return data;
    });
  }

  fetch(search?: string): Promise<T> {
    return axios.get<T>(buildSearchRouteFromBase(this.baseRoute, search), { headers }).then(({ data }) => {
      return data;
    });
  }

  update(id: string, updates: Partial<T>): Promise<T> {
    return axios.patch<T>(buildRouteFromBase(this.baseRoute, id), { updates }, { headers }).then(({ data }) => {
      return data;
    });
  }

  delete(id: string): Promise<T> {
    return axios.delete<T>(buildRouteFromBase(this.baseRoute, id), { headers }).then(({ data }) => {
      return data;
    });
  }
}

function buildRouteFromBase(route: string, ...params: string[]): string {
  // TODO more elegant solution for this? If we're not making a CORS request, we won't need the http prefix. Also what if https is required?
  return 'http://' + ((baseUrl + '/' + route + '/' + (params ? params.join('/') : '')).replace(/\/{2,}/gi, '/'));
}

function buildSearchRouteFromBase(route: string, query: string) {
  return buildRouteFromBase(route) + '?text=' + query;
}

// DEFINE SERVICES
export const ArticlesService = new Service<any>('/articles');

export const CategoriesService = new Service<any>('/categories');

export const TagsService = new Service<any>('/tags');

export const UsersService = new Service<any>('/users');

export const AuthService = new class {

  login(username: string, password: string) {
    return axios.post(buildRouteFromBase('/users/tokens'), { user: { username, password } }, { headers }).then(({ data }) => {
      return data;
    })
   }
 
   authenticate(): Promise<any> {
     return axios.get<any>(buildRouteFromBase('/users/tokens'), { headers }).then(({ data }) => {
       return data;
     });
   }
}()
