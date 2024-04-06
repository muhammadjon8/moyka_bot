import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.models';
import { Context, Markup, Telegraf } from 'telegraf';
import { BOT_NAME } from '../add.constants';
import { InjectBot, On, Ctx, Hears } from 'nestjs-telegraf';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private botRepo: typeof Bot,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
  ) {}

  
  async start(@Ctx() ctx: Context) {
    const userId = ctx.from.id;

    console.log('ctx ', ctx);
    const user = await this.botRepo.findByPk(userId);
    if (!user) {
      await this.botRepo.create({
        user_id: userId,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
      });

      await ctx.reply(`Iltimos,<b> Telofon raqamini  yuboring </b>`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          [Markup.button.contactRequest('Send phone number')],
        ])
          .resize()
          .oneTime(),
      });
    } else if (!user.status) {
      await ctx.reply(
        `Iltimos,<b> Telofon raqamini  yuboring </b> tugmasini bosing`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('📞Tefofon raqamini yuborish')],
          ])
            .resize()
            .oneTime(),
        },
      );
    } else {
      await ctx.reply(
        `Bu bot orqali stadium dasturi bilan muloqot ornatiladi!`,
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
  }

  async onContact(@Ctx() ctx: Context) {
    if ('contact' in ctx.message) {
      const userId = ctx.from.id;
      const user = await this.botRepo.findByPk(userId);
      if (!user) {
        await ctx.reply(`Iltimos, <b>"/start"<b> tugmasini bosing`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .resize()
            .oneTime(),
        });
      } else if (ctx.message.contact.user_id != userId) {
        await ctx.reply(`Iltimos, o'zingizni raqamizi yuboring!`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('📞 Sending phone number')],
          ])
            .resize()
            .oneTime(),
        });
      } else {
        await this.botRepo.update(
          {
            phone_number: ctx.message.contact.phone_number,
            status: true,
          },
          { where: { user_id: userId } },
        );
        const inlineKeyboard = [
          [
            {
              text: 'Email',
              callback_data: 'email',
            },
          ],
        ];
        await ctx.reply(`To'liq botdan foydalanish uchun emailni kiriting:`, {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(inlineKeyboard),
        });
      }
    }
  }

  
  // async onEmail(@Ctx() ctx: Context) {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if ('text' in ctx.message) {
  //     if (!emailRegex.test(ctx.message.text)) {
  //       await ctx.replyWithHTML(`Iltimos to'g'ri email kiriting`);
  //     } else {
  //       await ctx.reply(`Tabriklayman, ro'yxatdan o'tdingiz! `, {
  //         parse_mode: 'HTML',
  //         ...Markup.removeKeyboard(),
  //       });
  //     }
  //   }
  // }
}
