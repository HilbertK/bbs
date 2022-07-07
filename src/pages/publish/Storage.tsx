import { ArticleParams } from '../../service/interface';

class PublishStorageService {
    private storageKey = 'store-article-publish';
    public setContentStorage(article: ArticleParams) {
        sessionStorage.setItem(this.storageKey, JSON.stringify(article));
    }

    public getStoragePublishArticle() {
        let article: ArticleParams | null = null;
        try {
            const articlesData = sessionStorage.getItem(this.storageKey);
            if (articlesData == null) return null;
            article = JSON.parse(articlesData);
        } catch(e) {
            console.error(e);
        }
        return article;
    }

    public clearContentStorage() {
        sessionStorage.removeItem(this.storageKey);
    }
}

export const publishStorageService = new PublishStorageService();