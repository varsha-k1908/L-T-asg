import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;
@WebServlet("/addcustomer")
public class customerservlet extends HttpServlet{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException{
        int customerID=Integer.parseInt(req.getParameter("id"));
        String customerName=req.getParameter("name");
        String customerEmail=req.getParameter("email");
        String customerPhonenumber=req.getParameter("number");
        String url = "jdbc:mysql://localhost:3306/customerdb";
        String username = "root";
        String password = "harinandan";
        Connection con = null;
        try {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
            con = DriverManager.getConnection(url, username, password);
        PreparedStatement stmt = con.prepareStatement("INSERT into customer values(?,?,?,?)");
        stmt.setInt(1,customerID);
        stmt.setString(2,customerName);
        stmt.setString(3,customerEmail);
        stmt.setString(4,customerPhonenumber);
        stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
