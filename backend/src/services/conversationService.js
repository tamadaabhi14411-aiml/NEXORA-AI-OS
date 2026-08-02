import Conversation from "../models/Conversation.js";

export async function getConversation(userId) {
  let conversation = await Conversation.findOne({
    user: userId,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      user: userId,
      messages: [],
    });
  }

  return conversation;
}

export async function saveConversation(userId, role, content) {
  const conversation = await getConversation(userId);

  conversation.messages.push({
    role,
    content,
  });

  // Keep only the latest 20 messages
  if (conversation.messages.length > 20) {
    conversation.messages = conversation.messages.slice(-20);
  }

  await conversation.save();

  return conversation;
}

export async function clearConversation(userId) {
  await Conversation.findOneAndUpdate(
    { user: userId },
    {
      messages: [],
    }
  );
}