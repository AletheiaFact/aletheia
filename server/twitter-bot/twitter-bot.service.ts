import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterBotService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async sendMessage(claimReview) {
    const twitterAccounts = claimReview.personality.twitterAccounts;
    const classification = claimReview.classification;
    const sentence = claimReview.sentence;
    const link = `https://aletheiafact.org/claim-review/${claimReview._id}`;

    twitterAccounts.forEach(async (account) => {
      let message = `@${account} your statement "${sentence}" was flagged by our volunteers as ${classification}, do you want to comment on that? #AletheiaFact.org #${classification} Link: ${link}`;

      if (message.length > 280) {
        message = `@${account} your statement "${sentence.substring(0, 100)}..." was flagged by our volunteers as ${classification}, do you want to comment on that? See full statement at ${link}`;
      }

      const url = this.configService.get('TWITTER_BOT_SERVICE_URL');
      await this.httpService.post(url, { message }).toPromise();
    });
  }
}

