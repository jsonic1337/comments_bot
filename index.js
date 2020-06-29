const {
	VK
} = require('vk-io');
const vk = new VK({
	token: " token " //токен от группы с разрешением на сообщения
});
var vk2 = new VK({
	token: '',
});
var start = '!старт',
	stop = '!стоп',
	help = '!help';
var admin = [1, 2]; //айди админов
vk.updates.start();
vk.updates.on('message', (context, next) => {
	if (context.isGroup == true && admin.indexOf(context.senderId) == -1) return
	if (context.text.toLowerCase().includes(start)) {
		let token = context.text.toLowerCase().replace(start, '').trim();
		vk2 = new VK({
			token: token,
		});
		context.send({
			message: ('токен изменен, скрипт запущен!')
		})
	}
	if (context.text.toLowerCase().includes(stop)) {
		vk2 = new VK({
			token: '',
		});
		context.send({
			message: ('токен удален, скрипт остановлен!')
		})
	}
	if (context.text.toLowerCase().includes(help)) {
		context.send({
			message: ('Команды:\n!старт ТутТокен\n!стоп')
		})
	}
})
var PHRASES = ['Message 1', 'Message 2']; // сообщения, которые бот будет оставлять под постом
var MILLISECONDS = 1000; // через сколько обновлять новости (в миллисекундах)
var ids = [];
var sample = (array) => array[Math.round((array.length - 1) * Math.random())];
setInterval(async () => {
	let {
		items
	} = await vk2.api.newsfeed.get({
		filters: 'post',
		count: 1
	});
	let post = items[0];
	if (ids.includes(post.source_id + '_' + post.post_id)) return;
	let msg = sample(PHRASES);
	ids.push(post.source_id + '_' + post.post_id)
	ids.shift()
	console.log(ids)
	await vk2.api.wall.createComment({
		owner_id: post.source_id,
		post_id: post.post_id,
		message: msg
	});
	console.log('Оставлен коммментарий')
}, MILLISECONDS);
