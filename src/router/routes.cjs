const models = require("../store/models.cjs");
const fns = require("../app/manyFunctions.cjs");
const images = require("../img/index.cjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

function removeDuplicates(arr, key) {
  const result = [];
  const duplicatesIndices = [];

  arr.forEach((current, index) => {
    if (duplicatesIndices.includes(index)) return;

    result.push(current.specification[key]);

    for (
      let comparisonIndex = index + 1;
      comparisonIndex < arr.length;
      comparisonIndex++
    ) {
      const comparison = arr[comparisonIndex];

      let valuesEqual = true;
      if (current.specification[key] !== comparison.specification[key]) {
        valuesEqual = false;
        break;
      }

      if (valuesEqual) duplicatesIndices.push(comparisonIndex);
    }
  });
  return [...new Set(result)];
}

module.exports = [
  fns.getAny("users", models.Users),
  // fns.getAny('products', models.Products),
  fns.getAny("news", models.News),
  fns.getAny("promos", models.Promos),
  fns.addAny("add-user", models.Users),
  fns.getOne("product", models.Products),
  {
    method: "post",
    path: "/login",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      const { obj, logType, token } = JSON.parse(body);
      let user;
      if (logType === "pass") {
        const phone = parseInt(obj.iden.replace("+", ""));
        if (!isNaN(phone)) {
          await models.Users.findOne({
            phone: phone,
            password: obj.password,
          }).then((result) => (user = result));
        } else {
          await models.Users.findOne({
            mail: obj.iden,
            password: obj.password,
          }).then((result) => (user = result));
        }
        if (user != null) {
          const id = user._id.toString();
          const token = jwt.sign({ id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });
          res.end(JSON.stringify({ token: token, user }));
        } else {
          res.statusCode = 401;
          res.end(JSON.stringify({ message: "Polzovatel ne naydyon" }));
        }
      } else {
        try {
          if (jwt.verify(token, process.env.SECRET_KEY, { expiresIn: "1d" })) {
            await models.Users.findOne({
              id: jwt.decode(token, { expiresIn: "1d" }),
            }).then((result) => (user = result));
            res.end(JSON.stringify({ user }));
          }
        } catch (e) {
          if (e.expiredAt) {
            res.statusCode = 401;
            res.end(
              JSON.stringify({
                message: "token expired",
                date: e.expiredAt.toString(),
              })
            );
          } else {
            res.statusCode = 500;
            res.end("nepredvidennaya oshibka");
          }
        }
      }
    },
  },
  {
    method: "post",
    path: "/sing-up",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      let phone = "";
      const obj = JSON.parse(body);
      for (let index = 0; index < obj.phone.length; index++) {
        const element = obj.phone[index];
        if (!isNaN(element) && element !== " ") phone += element;
      }
      const user = await models.Users.create({
        ...obj,
        phone: Number(phone),
        favorites: [],
        cart: [],
        viewed: [],
        compare: [],
      });
      if (user !== null) {
        const id = user._id.toString();
        const token = jwt.sign({ id }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        res.end(JSON.stringify({ token: token, user }));
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Polzovatel ne sozdalsa" }));
      }
    },
  },
  {
    method: "post",
    path: "/update-user",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      let upt;
      let data = await models.Users.findOne({ _id: body.id });
      let arr = [];
      if (body.method === "add") {
        arr = [...data[body.module], body.data];
      } else if (body.method === "remove") {
        arr = data[body.module].filter((item) => item.id !== body.data.id);
      }
      await models.Users.findOneAndUpdate(
        { _id: body.id },
        { [body.module]: arr },
        { new: true }
      ).then((result) => (upt = result));
      if (data[body.module].length !== upt[body.module].length) {
        res.end(
          JSON.stringify({
            message: "User succesfully updated",
            user: upt,
          })
        );
      } else {
        res.statusCode = 403;
        res.end(
          JSON.stringify({
            message: "User update failed",
          })
        );
      }
    },
  },
  {
    method: "get",
    path: "/index-products",
    arrow: async (req, res) => {
      let result = await models.Customs.find({}).then((res) => res[0]?.indexP);
      if (result !== null) {
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          let arr = await models.Products.find({ _id: { $in: element.every } });
          result[index] = {
            title: element.title,
            href: element.href,
            every: arr,
          };
        }
        res.end(JSON.stringify(result));
      } else {
        res.end("indexP hali berilmagan");
      }
    },
  },
  {
    method: "get",
    path: "/get-rec",
    arrow: async (req, res) => {
      let result = await models.Customs.find({}).then((res) => res[0]?.recs);
      if (result !== null) {
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          await models.Products.findById(element).then(
            (res) => (result[index] = res)
          );
        }
        res.end(JSON.stringify(result));
      } else {
        res.end("recs hali berilmagan");
      }
    },
  },
  {
    method: "post",
    path: "/add-comment",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      const resp = await models.Comments.create(body);
      res.end(JSON.stringify(resp));
    },
  },
  {
    method: "post",
    path: "/get-user-data",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      let arr = await models.Users.find({ _id: { $in: body.userId } }).select(
        body.keys
      );
      res.end(JSON.stringify(arr));
    },
  },
  {
    method: "get",
    path: "/get-index-promos",
    arrow: async (req, res) => {
      let result = await models.Customs.find({}).then(
        (res) => res[0]?.indexPromos
      );
      if (result !== null) {
        res.end(JSON.stringify(result));
      } else {
        res.end("indexPromos hali berilmagan");
      }
    },
  },
  {
    method: "get",
    path: "/filter-checks",
    arrow: async (req, res) => {
      let products = await models.Products.find();
      let sorted = [...products].sort((a, b) => a.price - b.price);
      let filtersChecks = {
        price: {
          min: sorted[0].price,
          max: sorted[sorted.length - 1].price,
        },
        cruise: {
          values: removeDuplicates(products, "cruise"),
          type: 0,
          title: "Подсветка",
        },
        power: {
          values: removeDuplicates(products, "power"),
          type: 1,
          title: "Мощность двигателя (Ватт)",
        },
        speed: {
          values: removeDuplicates(products, "speed"),
          type: 1,
          title: "Максимальная скорость (км/ч)",
        },
        typeP: {
          values: removeDuplicates(products, "typeP"),
          type: 1,
          title: "Type",
        },
        // 0 radio
        // 1 checkbox
      };
      res.end(JSON.stringify(filtersChecks));
    },
  },
  {
    method: "post",
    path: "/products",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      let filter = {};
      Object.entries(body.filter).forEach(([key, value], index) => {
        if (key !== "prices") {
          if (value !== null && value.length) {
            filter = { ...filter, [`specification.${key}`]: { $in: value } };
          }
        }
      });
      if (body.filter.prices.min && body.filter.prices.max) {
        filter = {
          ...filter,
          price: {
            $gte: body.filter.prices.min,
            $lte: body.filter.prices.max,
          },
        };
      }
      let products = await models.Products.find(filter);
      res.end(
        JSON.stringify({
          products: products.slice(
            (body.page - 1) * body.perPage,
            body.page * body.perPage
          ),
          allength: Math.ceil(products.length / body.perPage),
        })
      );
    },
  },
  fns.getAny("cities", models.Cities),
  fns.getAny("days-deliv", models.DaysToDeliv),
  fns.getAny("type-pays", models.TypePay),
  {
    method: "post",
    path: "/address-shops",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      let result = await models.AddressShops.find({ city: body.cityId });
      res.end(JSON.stringify(result));
    },
  },
  {
    method: "post",
    path: "/order-deliv",
    arrow: async (req, res) => {
      try {
        let body = new String();
        await req.on("data", (chunk) => {
          body += chunk;
        });
        await models.OrdersDeliv.create(JSON.parse(body));
        body = JSON.parse(body);
        await models.Users.findByIdAndUpdate(
          body.userId,
          {
            cart: [],
          },
          { new: true }
        );
        res.end(JSON.stringify(true));
      } catch (e) {
        console.log(e);
        res.end(JSON.stringify(false));
      }
    },
  },
  {
    method: "post",
    path: "/order-pick",
    arrow: async (req, res) => {
      try {
        let body = new String();
        await req.on("data", (chunk) => {
          body += chunk;
        });
        await models.OrdersPick.create(JSON.parse(body));
        body = JSON.parse(body);
        await models.Users.findByIdAndUpdate(
          body.userId,
          {
            cart: [],
          },
          { new: true }
        );
        res.end(JSON.stringify(true));
      } catch (e) {
        console.log(e);
        res.end(JSON.stringify(false));
      }
    },
  },
  fns.getDWP("promos", models.Promos),
  fns.getOne("promo", models.Promos),
  fns.getDWP("news", models.News),
  {
    method: "post",
    path: "/update-profile",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      res.end(body);
      // let data = await models.Users.findOne({ _id: body.id })
      // let arr = [];
      // let upt = await models.Users.findOneAndUpdate(
      //   { _id: body.id },
      //   body,
      //   { new: true }
      // )
      // res.end(
      //   JSON.stringify({
      //     message: "User succesfully updated",
      //     user: upt,
      //   })
      // );
    },
  },
  {
    method: "post",
    path: "/user-orders",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      let data1 = await models.OrdersDeliv.find({ userId: body.userId });
      let data2 = await models.OrdersPick.find({ userId: body.userId });
      let data = [...data1, ...data2];
      res.end(
        JSON.stringify({
          data: data.slice(
            (body.page - 1) * body.perPage,
            body.page * body.perPage
          ),
          allength: Math.ceil(data.length / body.perPage),
          productsL: data.length,
        })
      );
    },
  },
  {
    method: "options",
    path: "/update-profile",
    arrow: async (req, res) => {
      res.statusCode = 200;
      res.end("ok");
    },
  },
  {
    method: "post",
    path: "/change-password",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      let oldUser = await models.Users.findById(body.userId);
      if (oldUser) {
        res.end("polzovatel ne naydyon");
      } else {
        if (oldUser.password === body.oldPassword) {
          let newUser = await models.Users.findById(oldUser._id, {
            password: body.newPassword,
          });
          res.end("succesfully updated");
        } else {
          res.end("password neverny");
        }
      }
    },
  },
  {
    method: "post",
    path: "/comments",
    arrow: async (req, res) => {
      let body = "";
      await req.on("data", (chunk) => {
        body += chunk;
      });
      body = JSON.parse(body);
      let result = await models.Comments.find({ city: body.cityId });
      res.end(JSON.stringify(result));
    },
  },
  ...images,
];
