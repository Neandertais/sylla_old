import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User, { Platforms } from "App/Models/User";
import { nanoid } from "nanoid";

export default class UsersController {
  public async show({ params: { username }, response }: HttpContextContract) {
    const user = await User.find(username);

    if (!user) {
      return response.notFound({ error: "User not found" });
    }

    return user;
  }

  public async update({
    auth: { user },
    params: { username },
    request,
    response,
  }: HttpContextContract) {
    // Check if user authenticated is them same user who will be updated
    if (username !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    const updateUserSchema = schema.create({
      username: schema.string.optional([
        rules.trim(),
        rules.minLength(6),
        rules.maxLength(56),
      ]),
      name: schema.string.optional([rules.minLength(6), rules.maxLength(80)]),
      profession: schema.string.optional([
        rules.minLength(4),
        rules.maxLength(80),
      ]),
      biography: schema.string.optional([
        rules.minLength(12),
        rules.maxLength(360),
      ]),
      social_links: schema.array.optional().members(
        schema.object().members({
          platform: schema.enum(Object.values(Platforms)),
          link: schema.string([rules.url()]),
        })
      ),
    });

    try {
      const payload = await request.validate({ schema: updateUserSchema });

      // Check if the username is already in use
      if (payload.username) {
        const user = await User.find(payload.username?.toLowerCase());
        if (user) {
          return response.conflict({ error: "Username is already in use" });
        }
      }

      // Merge payload with user
      user?.merge(payload);

      // Upload avatar image
      const avatar = request.file("avatar", {
        size: "10mb",
        extnames: ["jpg", "png", "webp"],
      });

      if (avatar?.isValid) {
        const filename = `${nanoid()}.${avatar.extname}`;

        await avatar.moveToDisk("./", {
          name: filename,
        });

        // TODO - remove image

        user?.merge({ avatar: filename });
      }

      await user?.save();

      return user;
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }
}
