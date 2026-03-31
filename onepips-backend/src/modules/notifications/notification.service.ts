import { Injectable } from "@nestjs/common";


@Injectable()
export class NotificationsService {
    private webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    async sendToDiscord(message: string) {
        if (!this.webhookUrl) return;

        try {
            await fetch(this.webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: message }),
            });
        } catch (error) {
            console.error("Discord webhook error:", error.message);
        }
    }
}