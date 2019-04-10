INSERT INTO `labels` (`id`,`labelName`,`code`) VALUES (DEFAULT,'家电','1');
INSERT INTO `labels` (`id`,`labelName`,`code`) VALUES (DEFAULT,'家具','2');
INSERT INTO `labels` (`id`,`labelName`,`code`) VALUES (DEFAULT,'手机','3');
INSERT INTO `labels` (`id`,`labelName`,`code`) VALUES (DEFAULT,'自行车','4');
INSERT INTO `labels` (`id`,`labelName`,`code`) VALUES (DEFAULT,'互联网','5');

// 插入banner图的数据
INSERT INTO `banners` (`description`,`jumpUrl`,`imageUrl`) VALUES ('开发微信全家桶项目Vue/Node/MongoDB高级技术栈全覆盖','','banner-1.jpg');
INSERT INTO `banners` (`description`,`jumpUrl`,`imageUrl`) VALUES ('真正的React全家桶——React、React-router、Redux','','banner2.jpg');
INSERT INTO `banners` (`description`,`jumpUrl`,`imageUrl`) VALUES ('Vue2.0+Node.js+MongoDB全栈打造商城系统','','banner3.jpg');
INSERT INTO `banners` (`description`,`jumpUrl`,`imageUrl`) VALUES ('二手佳能单反相机低价出售','','banner4.jpg');
INSERT INTO `banners` (`description`,`jumpUrl`,`imageUrl`) VALUES ('二手三洋豆浆机低价出售','','banner5.jpg');

// 热搜
INSERT INTO `hot_searches` (`id`,`hot_search`,`updated_at`) VALUES (DEFAULT,'vue',DEFAULT);
INSERT INTO `hot_searches` (`id`,`hot_search`,`updated_at`) VALUES (DEFAULT,'react',DEFAULT);
INSERT INTO `hot_searches` (`id`,`hot_search`,`updated_at`) VALUES (DEFAULT,'node',DEFAULT);
INSERT INTO `hot_searches` (`id`,`hot_search`,`updated_at`) VALUES (DEFAULT,'家电',DEFAULT);
INSERT INTO `hot_searches` (`id`,`hot_search`,`updated_at`) VALUES (DEFAULT,'webpack',DEFAULT);
INSERT INTO `hot_searches` (`id`,`hot_search`,`updated_at`) VALUES (DEFAULT,'自行车',DEFAULT);
INSERT INTO `hot_searches` (`id`,`hot_search`,`updated_at`) VALUES (DEFAULT,'笔记本',DEFAULT);
