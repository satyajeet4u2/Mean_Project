import {PostModel} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: PostModel[] = [];
  private postUpdate = new Subject<PostModel[]>();

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getSinglePost(id: string) {
    // return {...this.posts.find(p => p.id === id)};
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>
    (environment.API_URL + '/posts/' + id);
  }

  getPost() {
    this.http.get<{ message: string, posts: any }>(environment.API_URL + '/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        });
      }))
      .subscribe((transformDataPost) => {
        console.log(transformDataPost);
        this.posts = transformDataPost;
        this.postUpdate.next([...this.posts]);
      });
    // return [...this.posts];
  }

  addPost(title: string, content: string, image: File) {
    // const post: PostModel = {id: null, title: title, content: content};
    const postData = new FormData();
    postData.append('title', title),
      postData.append('content', content),
      postData.append('image', image, title);
    this.http.post<{ message: string, post: PostModel }>(environment.API_URL + '/posts', postData).subscribe(responseData => {
      // const id = responceData.postId;
      const post: PostModel = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath,
        creator: responseData.post.creator
      };
      this.posts.push(post);
      this.postUpdate.next([...this.posts]);
      this.router.navigate(['/']);
    });
    // this.postUpdate.complete();
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: PostModel = {id: id, title: title, content: content, imagePath: null};
    let postData: PostModel | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id, title: title, content: content, imagePath: image, creator: null
      };
    }
    this.http.put<{ imagePath: any, creator: string }>(environment.API_URL + '/posts/' + id, postData).subscribe(response => {
      const updtePosts = [...this.posts];
      const oldPostIndex = updtePosts.findIndex(p => p.id === id);
      const post: PostModel = {id: id, title: title, content: content, imagePath: response.imagePath, creator: response.creator};
      updtePosts[oldPostIndex] = post;
      this.posts = updtePosts;
      this.postUpdate.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId) {
    this.http.delete(environment.API_URL + '/posts/' + postId).subscribe(() => {
      const updatedPost = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPost;
      this.postUpdate.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postUpdate.asObservable();
  }
}
