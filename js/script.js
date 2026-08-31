
const cartKey="berlingCart";

function getCart(){
  try { return JSON.parse(localStorage.getItem(cartKey)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(cartKey, JSON.stringify(cart)); }

function updateCartCount(){
  const count = getCart().reduce((sum,item)=>sum + Number(item.qty || 0),0);
  document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
}

function addToCart(name, price, image, size="M"){
  const cart=getCart();
  const found=cart.find(i => i.name===name && i.size===size);
  if(found) found.qty += 1;
  else cart.push({name, price:Number(price), image, size, qty:1});
  saveCart(cart);
  updateCartCount();
  alert("Producto agregado al carrito.");
}

function renderCart(){
  const container=document.querySelector("[data-cart]");
  if(!container) return;
  const cart=getCart();
  const empty=document.querySelector("[data-empty-cart]");
  if(!cart.length){
    container.innerHTML = "";
    if(empty) empty.hidden=false;
    updateTotals(0);
    return;
  }
  if(empty) empty.hidden=true;
  container.innerHTML=cart.map((item,index)=>`
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong>
        <div class="muted">Talle ${item.size}</div>
        <div class="price">$${item.price.toLocaleString("es-AR")}</div>
      </div>
      <div class="qty">
        <button onclick="changeQty(${index},-1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index},1)">+</button>
        <button class="filter" onclick="removeItem(${index})">Eliminar</button>
      </div>
    </div>`).join("");
  updateTotals(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
}

function changeQty(index,delta){
  const cart=getCart();
  cart[index].qty += delta;
  if(cart[index].qty<=0) cart.splice(index,1);
  saveCart(cart); renderCart(); updateCartCount();
}
function removeItem(index){
  const cart=getCart();
  cart.splice(index,1);
  saveCart(cart); renderCart(); updateCartCount();
}
function updateTotals(subtotal){
  const shipping = subtotal===0 ? 0 : (subtotal>=80000 ? 0 : 4500);
  const total=subtotal+shipping;
  const s=document.querySelector("[data-subtotal]");
  const sh=document.querySelector("[data-shipping]");
  const t=document.querySelector("[data-total]");
  if(s)s.textContent="$"+subtotal.toLocaleString("es-AR");
  if(sh)sh.textContent=shipping===0 ? "Gratis" : "$"+shipping.toLocaleString("es-AR");
  if(t)t.textContent="$"+total.toLocaleString("es-AR");
}

document.addEventListener("DOMContentLoaded",()=>{
  updateCartCount();
  renderCart();

  document.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      addToCart(btn.dataset.name,btn.dataset.price,btn.dataset.image,btn.dataset.size || "M");
    });
  });

  const menu=document.querySelector("[data-menu]");
  const links=document.querySelector(".nav-links");
  if(menu && links){
    menu.addEventListener("click",()=>{
      const open=links.style.display==="flex";
      links.style.display=open?"none":"flex";
      if(!open){
        links.style.position="absolute";
        links.style.top="62px";
        links.style.left="0";
        links.style.right="0";
        links.style.padding="18px";
        links.style.background="#050a12";
        links.style.flexDirection="column";
        links.style.borderBottom="1px solid rgba(255,255,255,.1)";
      }
    });
  }
});
